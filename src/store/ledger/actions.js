import { STATE } from "../../constant";

// ---- Journal list ----
export function journalRequest(token, filters, page) {
    return {
        type: STATE.LEDGER_JOURNAL_REQUEST,
        payload: { token, filters, page }
    }
}

export function journalReset() {
    return { type: STATE.LEDGER_JOURNAL_RESET }
}

// ---- Single journal entry (the drawer in FE-11) ----
export function journalEntryRequest(token, entryId) {
    return {
        type: STATE.LEDGER_JOURNAL_ENTRY_REQUEST,
        payload: { token, entryId }
    }
}

export function journalEntryReset() {
    return { type: STATE.LEDGER_JOURNAL_ENTRY_RESET }
}

// ---- Card statement ----
export function cardStatementRequest(token, cardId, filters, page) {
    return {
        type: STATE.LEDGER_CARD_STATEMENT_REQUEST,
        payload: { token, cardId, filters, page }
    }
}

export function cardStatementReset() {
    return { type: STATE.LEDGER_CARD_STATEMENT_RESET }
}

// ---- Account statement ----
export function accountStatementRequest(token, code, filters, page) {
    return {
        type: STATE.LEDGER_ACCOUNT_STATEMENT_REQUEST,
        payload: { token, code, filters, page }
    }
}

export function accountStatementReset() {
    return { type: STATE.LEDGER_ACCOUNT_STATEMENT_RESET }
}

// ---- Trial balance ----
export function trialBalanceRequest(token, asOf) {
    return {
        type: STATE.LEDGER_TRIAL_BALANCE_REQUEST,
        payload: { token, asOf }
    }
}

export function trialBalanceReset() {
    return { type: STATE.LEDGER_TRIAL_BALANCE_RESET }
}

// ---- Integrity ----
export function integrityRequest(token) {
    return {
        type: STATE.LEDGER_INTEGRITY_REQUEST,
        payload: { token }
    }
}

export function integrityReset() {
    return { type: STATE.LEDGER_INTEGRITY_RESET }
}
