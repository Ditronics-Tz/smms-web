import { call, put, takeLatest } from 'redux-saga/effects';
import { STATE } from "../../constant";
import {
    getJournal,
    getJournalEntry,
    getCardStatement,
    getAccountStatement,
    getTrialBalance,
    getIntegrity,
    LEDGER_PAGE_SIZE,
} from '../../service/ledger';
import { apiErrorMessage, errorMessage } from '../../utils';

/**
 * FE-10 — ledger sagas.
 *
 * Every task follows the existing pattern: LOADING -> call the service -> SUCCESS
 * with the envelope as the payload and the page in `meta` (the reducer needs the
 * page to build its pagination block), or FAILURE with a message.
 *
 * The ledger is read-only, so there are no *_RESET-style confirm flows here; the
 * *Reset actions exist only so a page can clear state when it unmounts.
 */

function* journalTask(action) {
    try {
        yield put({ type: STATE.LEDGER_JOURNAL_LOADING });

        const { token, filters, page } = action.payload;

        const res = yield call(getJournal, token, filters, page);

        if (res.status === 200) {
            yield put({
                type: STATE.LEDGER_JOURNAL_SUCCESS,
                payload: res.data,
                meta: { page: page ?? 1, pageSize: LEDGER_PAGE_SIZE }
            })
        } else {
            yield put({
                type: STATE.LEDGER_JOURNAL_FAILURE,
                payload: res.data ? apiErrorMessage(res.data) : errorMessage(1000)
            })
        }
    } catch (e) {
        yield put({
            type: STATE.LEDGER_JOURNAL_FAILURE,
            payload: apiErrorMessage(e?.data ?? e)
        })
    }
}

function* journalEntryTask(action) {
    try {
        yield put({ type: STATE.LEDGER_JOURNAL_ENTRY_LOADING });

        const { token, entryId } = action.payload;

        const res = yield call(getJournalEntry, token, entryId);

        if (res.status === 200) {
            yield put({
                type: STATE.LEDGER_JOURNAL_ENTRY_SUCCESS,
                payload: res.data
            })
        } else {
            yield put({
                type: STATE.LEDGER_JOURNAL_ENTRY_FAILURE,
                payload: res.data ? apiErrorMessage(res.data) : errorMessage(1000)
            })
        }
    } catch (e) {
        yield put({
            type: STATE.LEDGER_JOURNAL_ENTRY_FAILURE,
            payload: apiErrorMessage(e?.data ?? e)
        })
    }
}

function* cardStatementTask(action) {
    try {
        yield put({ type: STATE.LEDGER_CARD_STATEMENT_LOADING });

        const { token, cardId, filters, page } = action.payload;

        const res = yield call(getCardStatement, token, cardId, filters, page);

        if (res.status === 200) {
            yield put({
                type: STATE.LEDGER_CARD_STATEMENT_SUCCESS,
                payload: res.data,
                meta: { page: page ?? 1, pageSize: LEDGER_PAGE_SIZE }
            })
        } else {
            yield put({
                type: STATE.LEDGER_CARD_STATEMENT_FAILURE,
                payload: res.data ? apiErrorMessage(res.data) : errorMessage(1000)
            })
        }
    } catch (e) {
        yield put({
            type: STATE.LEDGER_CARD_STATEMENT_FAILURE,
            payload: apiErrorMessage(e?.data ?? e)
        })
    }
}

function* accountStatementTask(action) {
    try {
        yield put({ type: STATE.LEDGER_ACCOUNT_STATEMENT_LOADING });

        const { token, code, filters, page } = action.payload;

        const res = yield call(getAccountStatement, token, code, filters, page);

        if (res.status === 200) {
            yield put({
                type: STATE.LEDGER_ACCOUNT_STATEMENT_SUCCESS,
                payload: res.data,
                meta: { page: page ?? 1, pageSize: LEDGER_PAGE_SIZE }
            })
        } else {
            yield put({
                type: STATE.LEDGER_ACCOUNT_STATEMENT_FAILURE,
                payload: res.data ? apiErrorMessage(res.data) : errorMessage(1000)
            })
        }
    } catch (e) {
        yield put({
            type: STATE.LEDGER_ACCOUNT_STATEMENT_FAILURE,
            payload: apiErrorMessage(e?.data ?? e)
        })
    }
}

function* trialBalanceTask(action) {
    try {
        yield put({ type: STATE.LEDGER_TRIAL_BALANCE_LOADING });

        const { token, asOf } = action.payload;

        const res = yield call(getTrialBalance, token, asOf);

        if (res.status === 200) {
            yield put({
                type: STATE.LEDGER_TRIAL_BALANCE_SUCCESS,
                payload: res.data
            })
        } else {
            yield put({
                type: STATE.LEDGER_TRIAL_BALANCE_FAILURE,
                payload: res.data ? apiErrorMessage(res.data) : errorMessage(1000)
            })
        }
    } catch (e) {
        yield put({
            type: STATE.LEDGER_TRIAL_BALANCE_FAILURE,
            payload: apiErrorMessage(e?.data ?? e)
        })
    }
}

function* integrityTask(action) {
    try {
        yield put({ type: STATE.LEDGER_INTEGRITY_LOADING });

        const { token } = action.payload;

        const res = yield call(getIntegrity, token);

        if (res.status === 200) {
            yield put({
                type: STATE.LEDGER_INTEGRITY_SUCCESS,
                payload: res.data
            })
        } else {
            yield put({
                type: STATE.LEDGER_INTEGRITY_FAILURE,
                payload: res.data ? apiErrorMessage(res.data) : errorMessage(1000)
            })
        }
    } catch (e) {
        yield put({
            type: STATE.LEDGER_INTEGRITY_FAILURE,
            payload: apiErrorMessage(e?.data ?? e)
        })
    }
}

export default function* ledgerSaga() {
    yield takeLatest(STATE.LEDGER_JOURNAL_REQUEST, journalTask);
    yield takeLatest(STATE.LEDGER_JOURNAL_ENTRY_REQUEST, journalEntryTask);
    yield takeLatest(STATE.LEDGER_CARD_STATEMENT_REQUEST, cardStatementTask);
    yield takeLatest(STATE.LEDGER_ACCOUNT_STATEMENT_REQUEST, accountStatementTask);
    yield takeLatest(STATE.LEDGER_TRIAL_BALANCE_REQUEST, trialBalanceTask);
    yield takeLatest(STATE.LEDGER_INTEGRITY_REQUEST, integrityTask);
}
