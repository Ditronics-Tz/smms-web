/**
 * FE-10 mock ledger data.
 *
 * Shaped exactly like the contract at the bottom of the task PDF so the screens
 * need no change when Ahmed merges BE-28/BE-29:
 *   - a list is { count, next, previous, results }
 *   - every amount is a decimal string ("600.00"), never a JS number
 *   - dates are ISO 8601
 *   - each journal entry is a BALANCED set of lines: total debit === total credit
 *
 * The set below covers every event_type in the contract, including the two the
 * UI must get right:
 *   - "penalty" where the amount charged is CLAMPED so the card balance stops at
 *     the -500 floor (entry-journal-06: a 600 penalty only charges 200 because
 *     the balance was already -300)
 *   - "card_replacement", which moves the balance from the old card to the new
 *     one with no income line (entry-journal-10)
 *
 * Nothing here is random: the numbers are fixed so screenshots, tests and the
 * trial balance stay reproducible.
 */

export type LedgerDirection = 'debit' | 'credit';

export type LedgerEventType =
    | 'purchase'
    | 'penalty'
    | 'deposit'
    | 'reversal'
    | 'card_replacement'
    | 'opening'
    | 'adjustment';

export type LedgerLine = {
    account: string;
    account_name: string;
    rfid_card: string | null;
    direction: LedgerDirection;
    amount: string;
    balance_after: string | null;
};

export type JournalEntry = {
    id: string;
    event_type: LedgerEventType;
    memo: string;
    created_at: string;
    ref_transaction: string | null;
    ref_deposit: string | null;
    card_number?: string | null;
    lines: LedgerLine[];
};

export type TrialBalanceRow = {
    account: string;
    account_name: string;
    total_debit: string;
    total_credit: string;
};

export type LedgerIntegrity = {
    status: 'ok' | 'mismatch';
    checked_at: string;
    global_balanced: boolean;
    mismatched_cards: {
        card_id: string;
        card_number: string;
        ledger_balance: string;
        card_balance: string;
    }[];
};

// ----- Account codes -----
export const ACCOUNT_CASH = { code: '1000', name: 'CASH_EQUIVALENT' };
export const ACCOUNT_WALLET = { code: '2000', name: 'WALLET_LIABILITY' };
export const ACCOUNT_SALES = { code: '4000', name: 'SALES_INCOME' };
export const ACCOUNT_PENALTY = { code: '4100', name: 'PENALTY_INCOME' };
export const ACCOUNT_ADJUSTMENT = { code: '4900', name: 'ADJUSTMENT_INCOME' };
export const ACCOUNT_REVERSAL = { code: '5000', name: 'REVERSAL_CONTRA' };

// ----- Card ids -----
export const CARD_A = 'a1f0c9e2-1111-4a1b-9c01-000000000001';
export const CARD_B = 'b2f0c9e2-2222-4a1b-9c01-000000000002';
export const CARD_C_OLD = 'c3f0c9e2-3333-4a1b-9c01-000000000003';
export const CARD_C_NEW = 'c3f0c9e2-3333-4a1b-9c01-000000000004';

export const CARD_NUMBERS: Record<string, string> = {
    [CARD_A]: 'A-0001',
    [CARD_B]: 'B-0002',
    [CARD_C_OLD]: 'C-0003',
    [CARD_C_NEW]: 'C-0004',
};

/** Amounts are decimal strings in the contract, never numbers. */
const money = (value: number) => value.toFixed(2);

const line = (
    account: string,
    account_name: string,
    direction: LedgerDirection,
    amount: number,
    rfid_card: string | null = null,
    balance_after: number | null = null,
): LedgerLine => ({
    account,
    account_name,
    rfid_card,
    direction,
    amount: money(amount),
    // balance_after only exists on a wallet line; every other line is null.
    balance_after: balance_after === null ? null : money(balance_after),
});

export const LEDGER_JOURNAL_ENTRIES: JournalEntry[] = [
    {
        id: 'entry-journal-01',
        event_type: 'opening',
        memo: 'Opening balance',
        created_at: '2026-09-01T07:00:00Z',
        ref_transaction: null,
        ref_deposit: null,
        card_number: 'A-0001',
        lines: [
            line(ACCOUNT_CASH.code, ACCOUNT_CASH.name, 'debit', 5000),
            line(ACCOUNT_WALLET.code, ACCOUNT_WALLET.name, 'credit', 5000, CARD_A, 5000),
        ],
    },
    {
        id: 'entry-journal-02',
        event_type: 'purchase',
        memo: 'Lunch - chips and juice',
        created_at: '2026-09-02T12:15:00Z',
        ref_transaction: '11111111-2222-3333-4444-555555555555',
        ref_deposit: null,
        card_number: 'A-0001',
        lines: [
            line(ACCOUNT_WALLET.code, ACCOUNT_WALLET.name, 'debit', 600, CARD_A, 4400),
            line(ACCOUNT_SALES.code, ACCOUNT_SALES.name, 'credit', 600),
        ],
    },
    {
        id: 'entry-journal-03',
        event_type: 'purchase',
        memo: 'Lunch - chapati with beef',
        created_at: '2026-09-03T12:20:00Z',
        ref_transaction: '22222222-2222-3333-4444-555555555555',
        ref_deposit: null,
        card_number: 'A-0001',
        lines: [
            line(ACCOUNT_WALLET.code, ACCOUNT_WALLET.name, 'debit', 1500, CARD_A, 2900),
            line(ACCOUNT_SALES.code, ACCOUNT_SALES.name, 'credit', 1500),
        ],
    },
    {
        id: 'entry-journal-04',
        event_type: 'adjustment',
        memo: 'Correction of a duplicate opening entry',
        created_at: '2026-09-04T09:30:00Z',
        ref_transaction: null,
        ref_deposit: null,
        card_number: 'A-0001',
        lines: [
            line(ACCOUNT_WALLET.code, ACCOUNT_WALLET.name, 'debit', 100, CARD_A, 2800),
            line(ACCOUNT_ADJUSTMENT.code, ACCOUNT_ADJUSTMENT.name, 'credit', 100),
        ],
    },
    {
        id: 'entry-journal-05',
        event_type: 'opening',
        memo: 'Opening balance',
        created_at: '2026-09-05T07:00:00Z',
        ref_transaction: null,
        ref_deposit: null,
        card_number: 'B-0002',
        lines: [
            line(ACCOUNT_CASH.code, ACCOUNT_CASH.name, 'debit', 200),
            line(ACCOUNT_WALLET.code, ACCOUNT_WALLET.name, 'credit', 200, CARD_B, 200),
        ],
    },
    {
        id: 'entry-journal-06',
        event_type: 'purchase',
        memo: 'Breakfast - mandazi',
        created_at: '2026-09-07T07:40:00Z',
        ref_transaction: '33333333-2222-3333-4444-555555555555',
        ref_deposit: null,
        card_number: 'B-0002',
        lines: [
            line(ACCOUNT_WALLET.code, ACCOUNT_WALLET.name, 'debit', 500, CARD_B, -300),
            line(ACCOUNT_SALES.code, ACCOUNT_SALES.name, 'credit', 500),
        ],
    },
    {
        id: 'entry-journal-07',
        event_type: 'penalty',
        // The rule this entry exists for: a 600 penalty was requested but the
        // balance was -300, and the floor is -500, so only 200 is charged.
        memo: 'Insufficient balance penalty (clamped at the -500 floor)',
        created_at: '2026-09-08T12:05:00Z',
        ref_transaction: '44444444-2222-3333-4444-555555555555',
        ref_deposit: null,
        card_number: 'B-0002',
        lines: [
            line(ACCOUNT_WALLET.code, ACCOUNT_WALLET.name, 'debit', 200, CARD_B, -500),
            line(ACCOUNT_PENALTY.code, ACCOUNT_PENALTY.name, 'credit', 200),
        ],
    },
    {
        id: 'entry-journal-08',
        event_type: 'reversal',
        memo: 'Operator reversed a duplicated scan',
        created_at: '2026-09-09T13:10:00Z',
        ref_transaction: '33333333-2222-3333-4444-555555555555',
        ref_deposit: null,
        card_number: 'B-0002',
        lines: [
            line(ACCOUNT_REVERSAL.code, ACCOUNT_REVERSAL.name, 'debit', 500),
            line(ACCOUNT_WALLET.code, ACCOUNT_WALLET.name, 'credit', 500, CARD_B, 0),
        ],
    },
    {
        id: 'entry-journal-09',
        event_type: 'deposit',
        memo: 'Cash deposit at the school office',
        created_at: '2026-09-10T08:00:00Z',
        ref_transaction: null,
        ref_deposit: 'dddddddd-2222-3333-4444-555555555555',
        card_number: 'B-0002',
        lines: [
            line(ACCOUNT_CASH.code, ACCOUNT_CASH.name, 'debit', 1000),
            line(ACCOUNT_WALLET.code, ACCOUNT_WALLET.name, 'credit', 1000, CARD_B, 1000),
        ],
    },
    {
        id: 'entry-journal-10',
        event_type: 'opening',
        memo: 'Opening balance',
        created_at: '2026-09-11T07:00:00Z',
        ref_transaction: null,
        ref_deposit: null,
        card_number: 'C-0003',
        lines: [
            line(ACCOUNT_CASH.code, ACCOUNT_CASH.name, 'debit', 2000),
            line(ACCOUNT_WALLET.code, ACCOUNT_WALLET.name, 'credit', 2000, CARD_C_OLD, 2000),
        ],
    },
    {
        id: 'entry-journal-11',
        event_type: 'card_replacement',
        // A replacement is NOT income: the same 2000 moves from the old card to
        // the new one, so the entry is two wallet lines and balances by itself.
        memo: 'Card reported lost, balance carried to the new card',
        created_at: '2026-09-12T10:45:00Z',
        ref_transaction: null,
        ref_deposit: null,
        card_number: 'C-0004',
        lines: [
            line(ACCOUNT_WALLET.code, ACCOUNT_WALLET.name, 'debit', 2000, CARD_C_NEW, 2000),
            line(ACCOUNT_WALLET.code, ACCOUNT_WALLET.name, 'credit', 2000, CARD_C_OLD, 0),
        ],
    },
];

/**
 * Trial balance, derived from the entries above so it can never drift.
 * Sum of total_debit and sum of total_credit are both 13600.00.
 */
export const buildTrialBalance = (entries: JournalEntry[] = LEDGER_JOURNAL_ENTRIES): TrialBalanceRow[] => {
    const totals = new Map<string, { name: string; debit: number; credit: number }>();

    entries.forEach((entry) => {
        entry.lines.forEach((l) => {
            const row = totals.get(l.account) ?? { name: l.account_name, debit: 0, credit: 0 };
            row[l.direction] += Number(l.amount);
            totals.set(l.account, row);
        });
    });

    return Array.from(totals.entries())
        .map(([account, row]) => ({
            account,
            account_name: row.name,
            total_debit: money(row.debit),
            total_credit: money(row.credit),
        }))
        .sort((a, b) => a.account.localeCompare(b.account));
};

export const LEDGER_TRIAL_BALANCE = buildTrialBalance();

/** Healthy ledger: every card agrees with its ledger balance. */
export const LEDGER_INTEGRITY_OK: LedgerIntegrity = {
    status: 'ok',
    checked_at: '2026-09-30T06:00:00Z',
    global_balanced: true,
    mismatched_cards: [],
};

/**
 * Unhealthy ledger. Exported so the FE-12 "Ledger health" card can be shown in
 * its red state for review/screenshots; the mock service returns the OK one.
 */
export const LEDGER_INTEGRITY_MISMATCH: LedgerIntegrity = {
    status: 'mismatch',
    checked_at: '2026-09-30T06:00:00Z',
    global_balanced: false,
    mismatched_cards: [
        {
            card_id: CARD_A,
            card_number: 'A-0001',
            ledger_balance: money(2800),
            card_balance: money(2500),
        },
        {
            card_id: CARD_B,
            card_number: 'B-0002',
            ledger_balance: money(1000),
            card_balance: money(1000.5),
        },
    ],
};

/** Convenience for the tests: true when every entry balances. */
export const isEntryBalanced = (entry: JournalEntry) => {
    const debit = entry.lines
        .filter((l) => l.direction === 'debit')
        .reduce((sum, l) => sum + Number(l.amount), 0);
    const credit = entry.lines
        .filter((l) => l.direction === 'credit')
        .reduce((sum, l) => sum + Number(l.amount), 0);
    return Math.abs(debit - credit) < 0.005;
};
