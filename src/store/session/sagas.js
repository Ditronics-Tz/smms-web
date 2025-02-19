import { call, put, takeLatest } from 'redux-saga/effects';
import { STATE } from "../../constant";
import { doScanCard, doSessionList, doStartSession, doEndSession, doScannedList, doTransactions } from '../../service/sessions';
import { errorMessage } from '../../utils';

// Scan Card
function* scanCardTask(action) {
    try {
        yield put({ type: STATE.SCAN_CARD_LOADING });

        const { payload } = action;

        const res = yield call(doScanCard,payload.token, payload.data);

        if (res.status === 201) {
            yield put({
                type: STATE.SCAN_CARD_SUCCESS,
                payload: res.data
            })
        } else {
            const errMsg = res.data ? errorMessage(res.data.code) : errorMessage(1000);
            yield put({
                type: STATE.SCAN_CARD_FAILURE,
                payload: errMsg
            })
        }
    } catch (e) {
        const errMsg = e.data ? errorMessage(e.code) : errorMessage(4000);
        yield put({
            type: STATE.SCAN_CARD_FAILURE,
            payload: errMsg
        })
    }
}

// Start Session
function* startSessionTask(action) {
    try {
        yield put({ type: STATE.START_SESSION_LOADING });

        const { payload } = action;

        const res = yield call(doStartSession,payload.token, payload.data);

        if (res.status === 201) {
            yield put({
                type: STATE.START_SESSION_SUCCESS,
                payload: res.data
            })
        } else {
            const errMsg = res.data ? errorMessage(res.data.code) : errorMessage(1000);
            yield put({
                type: STATE.START_SESSION_FAILURE,
                payload: errMsg
            })
        }
    } catch (e) {
        const errMsg = e.data ? errorMessage(e.code) : errorMessage(4000);
        yield put({
            type: STATE.START_SESSION_FAILURE,
            payload: errMsg
        })
    }
}

// end Session
function* endSessionTask(action) {
    try {
        yield put({ type: STATE.END_SESSION_LOADING });

        const { payload } = action;

        const res = yield call(doEndSession,payload.token, payload.data);

        if (res.status === 200) {
            yield put({
                type: STATE.END_SESSION_SUCCESS,
                payload: res.data
            })
        } else {
            const errMsg = res.data ? errorMessage(res.data.code) : errorMessage(1000);
            yield put({
                type: STATE.END_SESSION_FAILURE,
                payload: errMsg
            })
        }
    } catch (e) {
        const errMsg = e.data ? errorMessage(e.code) : errorMessage(4000);
        yield put({
            type: STATE.END_SESSION_FAILURE,
            payload: errMsg
        })
    }
}

// Session List
function* sessionListTask(action) {
    try {
        yield put({ type: STATE.SESSION_LIST_LOADING });

        const { payload } = action;

        const res = yield call(doSessionList,payload.token, payload.data);

        if (res.status === 200) {
            yield put({
                type: STATE.SESSION_LIST_SUCCESS,
                payload: res.data
            })
        } else {
            const errMsg = res.data ? errorMessage(res.data.code) : errorMessage(1000);
            yield put({
                type: STATE.SESSION_LIST_FAILURE,
                payload: errMsg
            })
        }
    } catch (e) {
        const errMsg = e.data ? errorMessage(e.code) : errorMessage(4000);
        yield put({
            type: STATE.SESSION_LIST_FAILURE,
            payload: errMsg
        })
    }
}



// Scanned List
function* scannedListTask(action) {
    try {
        yield put({ type: STATE.SCANNED_LIST_LOADING });

        const { payload } = action;

        const res = yield call(doScannedList,payload.token, payload.data, payload.page);

        if (res.status === 200) {
            yield put({
                type: STATE.SCANNED_LIST_SUCCESS,
                payload: res.data
            })
        } else {
            const errMsg = res.data ? errorMessage(res.data.code) : errorMessage(1000);
            yield put({
                type: STATE.SCANNED_LIST_FAILURE,
                payload: errMsg
            })
        }
    } catch (e) {
        const errMsg = e.data ? errorMessage(e.code) : errorMessage(4000);
        yield put({
            type: STATE.SCANNED_LIST_FAILURE,
            payload: errMsg
        })
    }
}


// Transactions List
function* transactionsTask(action) {
    try {
        yield put({ type: STATE.TRANSACTIONS_LOADING });

        const { payload } = action;

        const res = yield call(doTransactions,payload.token, payload.data, payload.page);

        if (res.status === 200) {
            yield put({
                type: STATE.TRANSACTIONS_SUCCESS,
                payload: res.data
            })
        } else {
            const errMsg = res.data ? errorMessage(res.data.code) : errorMessage(1000);
            yield put({
                type: STATE.TRANSACTIONS_FAILURE,
                payload: errMsg
            })
        }
    } catch (e) {
        const errMsg = e.data ? errorMessage(e.code) : errorMessage(4000);
        yield put({
            type: STATE.TRANSACTIONS_FAILURE,
            payload: errMsg
        })
    }
}



function* sessionSaga() {
    yield takeLatest(STATE.SCAN_CARD_REQUEST, scanCardTask);
    yield takeLatest(STATE.START_SESSION_REQUEST, startSessionTask);
    yield takeLatest(STATE.END_SESSION_REQUEST, endSessionTask); 
    yield takeLatest(STATE.SCANNED_LIST_REQUEST, scannedListTask);
    yield takeLatest(STATE.SESSION_LIST_REQUEST, sessionListTask);
    yield takeLatest(STATE.TRANSACTIONS_REQUEST, transactionsTask)
}

export default sessionSaga