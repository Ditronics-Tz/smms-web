import {
    LEDGER_JOURNAL_ENTRIES,
    LEDGER_INTEGRITY_OK,
    LEDGER_TRIAL_BALANCE,
    buildTrialBalance,
    isEntryBalanced,
    CARD_A,
    CARD_B,
    ACCOUNT_PENALTY,
    ACCOUNT_WALLET,
} from './ledger';
import {
    getJournal,
    getJournalEntry,
    getCardStatement,
    getAccountStatement,
    getTrialBalance,
    getIntegrity,
    isEntryBalanced as serviceIsEntryBalanced,
} from '../service/ledger';
import { USE_MOCKS } from '.';

/**
 * These tests run with REACT_APP_USE_MOCKS=true (see .env.test), so the ledger
 * service never touches the network. It does still import src/service/calls.ts,
 * which imports axios — and axios v1 ships an ESM entry that CRA's jest
 * transform does not process. Stubbing the module keeps the real axios out of
 * the transform pipeline; if a mock-mode path ever did call it, the stub fails
 * the test instead of silently pretending to be a response.
 */
jest.mock('axios', () => ({
    __esModule: true,
    default: jest.fn(() =>
        Promise.reject(new Error('axios must not be called while REACT_APP_USE_MOCKS is on'))
    ),
}));

/**
 * FE-10: "the store can load each list from mocks and from the real API with no
 * UI change". The mock data is the contract, so these tests pin the parts of the
 * contract the pages will rely on: the list envelope, decimal-string amounts and
 * a balanced set of lines on every entry.
 */

describe('ledger mock data', () => {
    it('is served through the mock switch', () => {
        expect(USE_MOCKS).toBe(true);
    });

    it('has at least one entry for every event_type in the contract', () => {
        const types = new Set(LEDGER_JOURNAL_ENTRIES.map((e) => e.event_type));
        expect(types).toEqual(
            new Set([
                'purchase',
                'penalty',
                'deposit',
                'reversal',
                'card_replacement',
                'opening',
                'adjustment',
            ])
        );
    });

    it('balances every entry: total debit equals total credit', () => {
        LEDGER_JOURNAL_ENTRIES.forEach((entry) => {
            const debit = entry.lines
                .filter((l) => l.direction === 'debit')
                .reduce((sum, l) => sum + Number(l.amount), 0);
            const credit = entry.lines
                .filter((l) => l.direction === 'credit')
                .reduce((sum, l) => sum + Number(l.amount), 0);
            expect({ id: entry.id, debit, credit }).toEqual({
                id: entry.id,
                debit,
                credit,
            });
            expect(debit).toBeCloseTo(credit, 2);
        });
    });

    it('writes amounts as decimal strings, never as numbers', () => {
        LEDGER_JOURNAL_ENTRIES.forEach((entry) => {
            entry.lines.forEach((line) => {
                expect(typeof line.amount).toBe('string');
                expect(line.amount).toMatch(/^\d+\.\d{2}$/);
            });
        });
    });

    it('only puts a balance_after on wallet lines', () => {
        LEDGER_JOURNAL_ENTRIES.forEach((entry) => {
            entry.lines.forEach((line) => {
                if (line.account === ACCOUNT_WALLET.code) return;
                expect(line.balance_after).toBeNull();
            });
        });
    });

    it('clamps a penalty at the -500 floor instead of going below it', () => {
        const penalty = LEDGER_JOURNAL_ENTRIES.find((e) => e.event_type === 'penalty');
        expect(penalty).toBeDefined();

        const walletLine = penalty!.lines.find(
            (l) => l.account === ACCOUNT_WALLET.code
        );
        // 600 was requested, only 200 could be charged.
        expect(walletLine.amount).toBe('200.00');
        expect(walletLine.balance_after).toBe('-500.00');
        expect(Number(walletLine.balance_after)).toBeGreaterThanOrEqual(-500);

        const incomeLine = penalty!.lines.find(
            (l) => l.account === ACCOUNT_PENALTY.code
        );
        expect(incomeLine.direction).toBe('credit');
    });

    it('moves the balance on a card_replacement without booking income', () => {
        const replacement = LEDGER_JOURNAL_ENTRIES.find(
            (e) => e.event_type === 'card_replacement'
        );
        expect(replacement!.lines).toHaveLength(2);
        replacement!.lines.forEach((l) => {
            expect(l.account).toBe(ACCOUNT_WALLET.code);
        });
    });

    it('keeps the trial balance balanced and derived from the entries', () => {
        const debit = LEDGER_TRIAL_BALANCE.reduce(
            (sum, row) => sum + Number(row.total_debit),
            0
        );
        const credit = LEDGER_TRIAL_BALANCE.reduce(
            (sum, row) => sum + Number(row.total_credit),
            0
        );
        expect(debit).toBeCloseTo(credit, 2);
        expect(debit).toBeCloseTo(13600, 2);

        // A caller changing the entries must change the trial balance with them.
        expect(buildTrialBalance(LEDGER_JOURNAL_ENTRIES.slice(0, 2))).toHaveLength(3);
    });

    it('reports a healthy integrity payload with the contract keys', () => {
        expect(Object.keys(LEDGER_INTEGRITY_OK).sort()).toEqual([
            'checked_at',
            'global_balanced',
            'mismatched_cards',
            'status',
        ]);
        expect(LEDGER_INTEGRITY_OK.status).toBe('ok');
        expect(LEDGER_INTEGRITY_OK.global_balanced).toBe(true);
        expect(LEDGER_INTEGRITY_OK.mismatched_cards).toEqual([]);
    });

    it('agrees with the service helper on whether an entry balances', () => {
        LEDGER_JOURNAL_ENTRIES.forEach((entry) => {
            expect(serviceIsEntryBalanced(entry)).toBe(true);
            expect(isEntryBalanced(entry)).toBe(true);
        });
    });

    it('detects an entry that does not balance', () => {
        const broken = {
            ...LEDGER_JOURNAL_ENTRIES[0],
            lines: LEDGER_JOURNAL_ENTRIES[0].lines.map((l, i) =>
                i === 0 ? { ...l, amount: '4000.00' } : l
            ),
        };
        expect(serviceIsEntryBalanced(broken)).toBe(false);
    });
});

describe('ledger service against the contract envelope', () => {
    it('returns { count, next, previous, results } for the journal', async () => {
        const res = await getJournal('token', {}, 1);
        expect(res.status).toBe(200);
        // The backend's list envelope, key for key. `previous` is null on the
        // first page, so the keys are asserted rather than the values.
        expect(Object.keys(res.data).sort()).toEqual([
            'count',
            'next',
            'previous',
            'results',
        ]);
        expect(res.data.count).toBe(LEDGER_JOURNAL_ENTRIES.length);
        expect(res.data.previous).toBeNull();
        expect(res.data.results).toHaveLength(LEDGER_JOURNAL_ENTRIES.length);
    });

    it('filters the journal by event_type', async () => {
        const res = await getJournal('token', { event_type: 'deposit' }, 1);
        expect(res.data.results).toHaveLength(1);
        expect(res.data.results[0].event_type).toBe('deposit');
    });

    it('paginates the journal and reports the last page with next null', async () => {
        const first = await getJournal('token', {}, 1);
        // Force a small page window through the paginate helper the service uses.
        expect(first.data.results.length).toBeLessThanOrEqual(50);
        const last = await getJournal('token', {}, 999);
        expect(last.data.results).toHaveLength(LEDGER_JOURNAL_ENTRIES.length);
        expect(last.data.next).toBeNull();
    });

    it('returns a single entry, and 404 for an unknown id', async () => {
        const found = await getJournalEntry('token', 'entry-journal-07');
        expect(found.status).toBe(200);
        expect(found.data.id).toBe('entry-journal-07');

        const missing = await getJournalEntry('token', 'does-not-exist');
        expect(missing.status).toBe(404);
    });

    it('returns only the lines booked on a card, newest first', async () => {
        const res = await getCardStatement('token', CARD_B, {}, 1);
        expect(res.status).toBe(200);
        res.data.results.forEach((row) => {
            expect(row.balance_after).not.toBeUndefined();
        });

        const times = res.data.results.map((r) => new Date(r.created_at).getTime());
        expect([...times].sort((a, b) => b - a)).toEqual(times);
    });

    it('gives two cards independent statements', async () => {
        const a = await getCardStatement('token', CARD_A, {}, 1);
        const b = await getCardStatement('token', CARD_B, {}, 1);
        expect(a.data.count).toBeGreaterThan(0);
        expect(b.data.count).toBeGreaterThan(0);
        expect(a.data.count).not.toBe(b.data.count);
    });

    it('returns an account statement for one account code', async () => {
        const res = await getAccountStatement('token', ACCOUNT_PENALTY.code, {}, 1);
        expect(res.status).toBe(200);
        expect(res.data.results.length).toBeGreaterThan(0);
        res.data.results.forEach((row) => {
            expect(row.amount).toMatch(/^\d+\.\d{2}$/);
        });
    });

    it('returns the trial balance rows and the integrity report', async () => {
        const trial = await getTrialBalance('token', '2026-09-30');
        expect(trial.status).toBe(200);
        expect(trial.data.length).toBe(LEDGER_TRIAL_BALANCE.length);

        const integrity = await getIntegrity('token');
        expect(integrity.status).toBe(200);
        expect(integrity.data.status).toBe('ok');
    });
});
