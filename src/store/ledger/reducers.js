import { STATE, STATUS } from "../../constant";

/**
 * FE-10 — ledger slice.
 *
 * The ledger is read-only, so there is no create/edit/delete state here at all;
 * a state key is a list, a single entry, the trial balance or the integrity
 * check, and nothing else.
 *
 * Each list keeps its OWN pagination block (count / next / previous / page /
 * total pages) so switching between the journal, a card statement and an account
 * statement never shows one list's page numbers under another's rows.
 *
 * This slice is intentionally NOT in the redux-persist whitelist: a ledger
 * balance read once is worse than a fresh one, and the persisted payload would
 * grow with every statement ever viewed.
 */

/** Fresh pagination block for a list that has not been requested yet. */
const initialPagination = {
    count: 0,
    next: null,
    previous: null,
    page: 1,
    pageSize: 50,
    totalPages: 0,
};

/** Reads the backend's { count, next, previous, results } envelope. */
const fromEnvelope = (data, page, pageSize) => ({
    results: data?.results ?? [],
    count: data?.count ?? 0,
    next: data?.next ?? null,
    previous: data?.previous ?? null,
    page,
    pageSize,
    totalPages: pageSize > 0 ? Math.ceil((data?.count ?? 0) / pageSize) : 0,
});

const INITIAL_STATE = {
    // journal list
    journalStatus: STATUS.DEFAULT,
    journalResult: null,
    journalErrorMessage: "",
    journalPagination: initialPagination,

    // single journal entry (drawer)
    journalEntryStatus: STATUS.DEFAULT,
    journalEntryResult: null,
    journalEntryErrorMessage: "",

    // card statement
    cardStatementStatus: STATUS.DEFAULT,
    cardStatementResult: null,
    cardStatementErrorMessage: "",
    cardStatementPagination: initialPagination,

    // account statement
    accountStatementStatus: STATUS.DEFAULT,
    accountStatementResult: null,
    accountStatementErrorMessage: "",
    accountStatementPagination: initialPagination,

    // trial balance
    trialBalanceStatus: STATUS.DEFAULT,
    trialBalanceResult: null,
    trialBalanceErrorMessage: "",

    // integrity
    integrityStatus: STATUS.DEFAULT,
    integrityResult: null,
    integrityErrorMessage: "",
};

const ledgerReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        // ---- journal list ----
        case STATE.LEDGER_JOURNAL_REQUEST:
            return {
                ...state,
                journalStatus: STATUS.LOADING,
                journalErrorMessage: "",
            };
        case STATE.LEDGER_JOURNAL_SUCCESS:
            return {
                ...state,
                journalStatus: STATUS.SUCCESS,
                journalResult: action.payload?.results ?? [],
                journalErrorMessage: "",
                journalPagination: fromEnvelope(
                    action.payload,
                    action.meta?.page ?? state.journalPagination.page,
                    action.meta?.pageSize ?? state.journalPagination.pageSize
                ),
            };
        case STATE.LEDGER_JOURNAL_FAILURE:
            return {
                ...state,
                journalStatus: STATUS.ERROR,
                journalErrorMessage: action.payload,
            };
        case STATE.LEDGER_JOURNAL_RESET:
            return {
                ...state,
                journalStatus: STATUS.DEFAULT,
                journalResult: null,
                journalErrorMessage: "",
                journalPagination: initialPagination,
            };

        // ---- single entry ----
        case STATE.LEDGER_JOURNAL_ENTRY_REQUEST:
            return {
                ...state,
                journalEntryStatus: STATUS.LOADING,
                journalEntryErrorMessage: "",
            };
        case STATE.LEDGER_JOURNAL_ENTRY_SUCCESS:
            return {
                ...state,
                journalEntryStatus: STATUS.SUCCESS,
                journalEntryResult: action.payload,
                journalEntryErrorMessage: "",
            };
        case STATE.LEDGER_JOURNAL_ENTRY_FAILURE:
            return {
                ...state,
                journalEntryStatus: STATUS.ERROR,
                journalEntryErrorMessage: action.payload,
            };
        case STATE.LEDGER_JOURNAL_ENTRY_RESET:
            return {
                ...state,
                journalEntryStatus: STATUS.DEFAULT,
                journalEntryResult: null,
                journalEntryErrorMessage: "",
            };

        // ---- card statement ----
        case STATE.LEDGER_CARD_STATEMENT_REQUEST:
            return {
                ...state,
                cardStatementStatus: STATUS.LOADING,
                cardStatementErrorMessage: "",
            };
        case STATE.LEDGER_CARD_STATEMENT_SUCCESS:
            return {
                ...state,
                cardStatementStatus: STATUS.SUCCESS,
                cardStatementResult: action.payload?.results ?? [],
                cardStatementErrorMessage: "",
                cardStatementPagination: fromEnvelope(
                    action.payload,
                    action.meta?.page ?? state.cardStatementPagination.page,
                    action.meta?.pageSize ?? state.cardStatementPagination.pageSize
                ),
            };
        case STATE.LEDGER_CARD_STATEMENT_FAILURE:
            return {
                ...state,
                cardStatementStatus: STATUS.ERROR,
                cardStatementErrorMessage: action.payload,
            };
        case STATE.LEDGER_CARD_STATEMENT_RESET:
            return {
                ...state,
                cardStatementStatus: STATUS.DEFAULT,
                cardStatementResult: null,
                cardStatementErrorMessage: "",
                cardStatementPagination: initialPagination,
            };

        // ---- account statement ----
        case STATE.LEDGER_ACCOUNT_STATEMENT_REQUEST:
            return {
                ...state,
                accountStatementStatus: STATUS.LOADING,
                accountStatementErrorMessage: "",
            };
        case STATE.LEDGER_ACCOUNT_STATEMENT_SUCCESS:
            return {
                ...state,
                accountStatementStatus: STATUS.SUCCESS,
                accountStatementResult: action.payload?.results ?? [],
                accountStatementErrorMessage: "",
                accountStatementPagination: fromEnvelope(
                    action.payload,
                    action.meta?.page ?? state.accountStatementPagination.page,
                    action.meta?.pageSize ?? state.accountStatementPagination.pageSize
                ),
            };
        case STATE.LEDGER_ACCOUNT_STATEMENT_FAILURE:
            return {
                ...state,
                accountStatementStatus: STATUS.ERROR,
                accountStatementErrorMessage: action.payload,
            };
        case STATE.LEDGER_ACCOUNT_STATEMENT_RESET:
            return {
                ...state,
                accountStatementStatus: STATUS.DEFAULT,
                accountStatementResult: null,
                accountStatementErrorMessage: "",
                accountStatementPagination: initialPagination,
            };

        // ---- trial balance ----
        case STATE.LEDGER_TRIAL_BALANCE_REQUEST:
            return {
                ...state,
                trialBalanceStatus: STATUS.LOADING,
                trialBalanceErrorMessage: "",
            };
        case STATE.LEDGER_TRIAL_BALANCE_SUCCESS:
            return {
                ...state,
                trialBalanceStatus: STATUS.SUCCESS,
                trialBalanceResult: action.payload?.results ?? action.payload,
                trialBalanceErrorMessage: "",
            };
        case STATE.LEDGER_TRIAL_BALANCE_FAILURE:
            return {
                ...state,
                trialBalanceStatus: STATUS.ERROR,
                trialBalanceErrorMessage: action.payload,
            };
        case STATE.LEDGER_TRIAL_BALANCE_RESET:
            return {
                ...state,
                trialBalanceStatus: STATUS.DEFAULT,
                trialBalanceResult: null,
                trialBalanceErrorMessage: "",
            };

        // ---- integrity ----
        case STATE.LEDGER_INTEGRITY_REQUEST:
            return {
                ...state,
                integrityStatus: STATUS.LOADING,
                integrityErrorMessage: "",
            };
        case STATE.LEDGER_INTEGRITY_SUCCESS:
            return {
                ...state,
                integrityStatus: STATUS.SUCCESS,
                integrityResult: action.payload,
                integrityErrorMessage: "",
            };
        case STATE.LEDGER_INTEGRITY_FAILURE:
            return {
                ...state,
                integrityStatus: STATUS.ERROR,
                integrityErrorMessage: action.payload,
            };
        case STATE.LEDGER_INTEGRITY_RESET:
            return {
                ...state,
                integrityStatus: STATUS.DEFAULT,
                integrityResult: null,
                integrityErrorMessage: "",
            };

        default:
            return state;
    }
};

export default ledgerReducer;
