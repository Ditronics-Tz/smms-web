import {
    LEDGER_JOURNAL_URL,
    LEDGER_TRIAL_BALANCE_URL,
    LEDGER_INTEGRITY_URL,
    ledgerJournalEntryUrl,
    ledgerCardStatementUrl,
    ledgerAccountStatementUrl,
} from '../../constant';
import { getListRequest, getRequest } from '../calls';
import { USE_MOCKS, mockList, mockResponse, paginate } from '../../mocks';
import {
    LEDGER_JOURNAL_ENTRIES,
    LEDGER_TRIAL_BALANCE,
    LEDGER_INTEGRITY_OK,
    buildTrialBalance,
} from '../../mocks/ledger';

/**
 * FE-10 — ledger reads. The ledger is append-only on the backend and READ-ONLY
 * in the UI: every function here is a GET and there is deliberately no create,
 * update or delete call.
 *
 * BE-28 covers trial-balance + integrity, BE-29 the journal and the statements.
 * Until those are merged the mock layer answers instead, but the returned shape
 * is identical in both paths so no page or saga has to know which one it got.
 *
 * Query parameters are passed straight through to the backend (from, to,
 * event_type, card_number, account, as_of, page) and the mocks filter on exactly
 * the same names, so the mock cannot drift into a second set of rules.
 */

export const LEDGER_PAGE_SIZE = 50;

const byCreatedAt = (a, b) => new Date(b.created_at) - new Date(a.created_at);

/** Only the wallet lines carry a balance, so a card filter reads those. */
const entryTouchesCard = (entry, cardId) =>
    entry.lines.some((l) => l.rfid_card === cardId);

/** The journal filter runs over a whole entry, not a single line. */
const entryMatches = (entry, filters = {}) => {
    const { from, to, event_type, card_number, account } = filters;

    if (from && new Date(entry.created_at) < new Date(from)) return false;
    if (to && new Date(entry.created_at) > new Date(to)) return false;
    if (event_type && entry.event_type !== event_type) return false;
    if (card_number && entry.card_number !== card_number) return false;
    if (account && !entry.lines.some((l) => l.account === account)) return false;

    return true;
};

/** An account statement is every line booked on that account, in date order. */
const accountStatementRows = (code, entries = LEDGER_JOURNAL_ENTRIES) =>
    entries
        .filter((entry) => entry.lines.some((l) => l.account === code))
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        .map((entry) => {
            const booked = entry.lines.filter((l) => l.account === code);
            return {
                id: entry.id,
                event_type: entry.event_type,
                memo: entry.memo,
                created_at: entry.created_at,
                rfid_card: booked.find((l) => l.rfid_card)?.rfid_card ?? null,
                card_number: entry.card_number ?? null,
                direction: booked[0].direction,
                amount: booked[0].amount,
                balance_after: booked[0].balance_after,
            };
        });

/**
 * GET /ledger/journal?from&to&event_type&card_number&account&page  (admin)
 * Journal entries, newest first. The list envelope is the backend's:
 * { count, next, previous, results }.
 */
export const getJournal = (token, filters = {}, page = 1) => {
    if (USE_MOCKS) {
        const results = LEDGER_JOURNAL_ENTRIES.filter((e) => entryMatches(e, filters)).sort(byCreatedAt);
        return Promise.resolve(mockList(results, page, LEDGER_PAGE_SIZE, LEDGER_JOURNAL_URL));
    }
    return getListRequest(token, LEDGER_JOURNAL_URL, filters, page);
};

/** GET /ledger/journal/{entry_id} — one entry with all of its lines. */
export const getJournalEntry = (token, entryId) => {
    if (USE_MOCKS) {
        const entry = LEDGER_JOURNAL_ENTRIES.find((e) => e.id === entryId);
        return Promise.resolve(entry ? mockResponse(entry) : mockResponse({ detail: 'Not found' }, 404));
    }
    return getRequest(token, ledgerJournalEntryUrl(entryId));
};

/**
 * GET /ledger/cards/{card_id}/statement?from&to&page
 * Admin, or the parent of that child — a parent asking for someone else's card
 * gets a 403 from the backend and the page shows it, it is not worked around.
 *
 * One row per journal entry on that card, with the running balance carried from
 * the line's balance_after.
 */
export const getCardStatement = (token, cardId, filters = {}, page = 1) => {
    if (USE_MOCKS) {
        const rows = LEDGER_JOURNAL_ENTRIES.filter((e) => entryTouchesCard(e, cardId))
            .filter((e) => entryMatches(e, filters))
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .map((entry) => {
                const walletLine = entry.lines.find((l) => l.rfid_card === cardId);
                return {
                    id: entry.id,
                    event_type: entry.event_type,
                    memo: entry.memo,
                    created_at: entry.created_at,
                    direction: walletLine.direction,
                    amount: walletLine.amount,
                    balance_after: walletLine.balance_after,
                    ref_transaction: entry.ref_transaction,
                    ref_deposit: entry.ref_deposit,
                };
            });
        return Promise.resolve(
            mockList(rows, page, LEDGER_PAGE_SIZE, ledgerCardStatementUrl(cardId))
        );
    }
    return getListRequest(token, ledgerCardStatementUrl(cardId), filters, page);
};

/** GET /ledger/accounts/{code}/statement?from&to&page  (admin) */
export const getAccountStatement = (token, code, filters = {}, page = 1) => {
    if (USE_MOCKS) {
        const rows = accountStatementRows(code).filter((row) => {
            if (filters.from && new Date(row.created_at) < new Date(filters.from)) return false;
            if (filters.to && new Date(row.created_at) > new Date(filters.to)) return false;
            if (filters.event_type && row.event_type !== filters.event_type) return false;
            return true;
        });
        return Promise.resolve(
            mockList(rows, page, LEDGER_PAGE_SIZE, ledgerAccountStatementUrl(code))
        );
    }
    return getListRequest(token, ledgerAccountStatementUrl(code), filters, page);
};

/**
 * GET /ledger/trial-balance?as_of  (admin)
 * { account, account_name, total_debit, total_credit } per row. Amounts stay
 * decimal strings all the way to formatMoney.
 */
export const getTrialBalance = (token, asOf) => {
    if (USE_MOCKS) {
        return Promise.resolve(mockResponse(buildTrialBalance()));
    }
    return getRequest(token, LEDGER_TRIAL_BALANCE_URL, { as_of: asOf });
};

/**
 * GET /ledger/integrity  (admin)
 * { status, checked_at, global_balanced, mismatched_cards: [{ card_id,
 *   card_number, ledger_balance, card_balance }] }
 */
export const getIntegrity = (token) => {
    if (USE_MOCKS) {
        return Promise.resolve(mockResponse(LEDGER_INTEGRITY_OK));
    }
    return getRequest(token, LEDGER_INTEGRITY_URL);
};

/**
 * Client-side balance check for one entry: total debit must equal total credit.
 * FE-11 shows this as the green "Balanced" chip in the drawer, and red when it
 * is not, so it is computed here rather than trusted from the response.
 */
export const isEntryBalanced = (entry) => {
    if (!entry?.lines?.length) return false;
    const sum = (direction) =>
        entry.lines
            .filter((l) => l.direction === direction)
            .reduce((total, l) => total + Number(l.amount || 0), 0);
    return Math.abs(sum('debit') - sum('credit')) < 0.005;
};

export { paginate, LEDGER_TRIAL_BALANCE, LEDGER_INTEGRITY_OK };
