import { call, put, takeLatest } from 'redux-saga/effects';
import { AMBASSADOR } from "../../../constant";
import { doFetchTransactionHistory, doTranferFund, doVerifyWithdraw, doWithdraw} from '../../../service/ambassadorService/transaction';
import errorMessage from "../../../utils/amb_error.json";

// check errors from web services
const errorFromWebSeviceCheck = (res) => {
    if (res.data.code == 'err68') {
        return res.data.message
    } else {
        return errorMessage[res.data.code]
    }
} 

function* transactionHistoryTask(action) {
    try {
        yield put({ type: AMBASSADOR.TRANSACTION_HISTORY_LOADING });
        
        const { payload } = action;

        const res = yield call(doFetchTransactionHistory, payload.token);

        if (res.status == 200) {
            yield put({
                type: AMBASSADOR.TRANSACTION_HISTORY_SUCCESS,
                payload: res.data
            });
        } else {
            res.data ? res.message = errorMessage[res.data.code] : res.message = errorMessage[1000];
            yield put({
                type: AMBASSADOR.TRANSACTION_HISTORY_FAILURE,
                payload: res.data
            })
        }
    } catch (e) {
        const errMsg = e.data ? errorMessage[e.code]  :  errorMessage[4000];
        yield put({
            type: AMBASSADOR.TRANSACTION_HISTORY_FAILURE,
            payload: errMsg
        })
    }
}

// tranfer fund to security
function* transferFundTask(action) {
    try {
        yield put ({type:AMBASSADOR.TRANSFER_FUND_LOADING});

        const { payload } = action;

        const res = yield call(doTranferFund, payload.token, payload.amount);

        if (res.status == 200) {
            yield put({
                type:AMBASSADOR.TRANSFER_FUND_SUCCESS,
                payload: res.data
            })
        } else {
            res.data ? res.message = errorFromWebSeviceCheck(res) : res.message = errorMessage[1000];
            yield put({
                type: AMBASSADOR.TRANSFER_FUND_FAILURE,
                payload: res.message
            })
        }
    } catch (e) {
        const errMsg = e.data ? errorMessage[e.code] : errorMessage[4000];
        yield put({
            type: AMBASSADOR.TRANSFER_FUND_FAILURE,
            payload: errMsg
        })
    }
}

function* withdrawTask(action) {
    try {
        yield put ({type:AMBASSADOR.WITHDRAW_LOADING});

        const { payload } = action;

        const res = yield call(doWithdraw, payload.token, payload.amount);

        if (res.status == 200) {
            yield put({
                type:AMBASSADOR.WITHDRAW_SUCCESS,
                payload: res.data
            })
        } else {
            res.data ? res.message = errorFromWebSeviceCheck(res) : res.message = errorMessage[1000];
            yield put({
                type: AMBASSADOR.WITHDRAW_FAILURE,
                payload: res.message
            })
        }
    } catch (e) {
        const errMsg = e.data ? errorMessage(e.code) : errorMessage(4000);
        yield put({
            type: AMBASSADOR.WITHDRAW_FAILURE,
            payload: errMsg
        })
    }
}

function* verifyWithdrawTask(action) {
    try {
        yield put ({type:AMBASSADOR.VERIFY_WITHDRAW_LOADING});

        const { payload } = action;

        const res = yield call(doVerifyWithdraw, payload.token, payload.request_id, payload.OTP);

        if (res.status == 200) {
            yield put({
                type:AMBASSADOR.VERIFY_WITHDRAW_SUCCESS,
                payload: res.data
            })
        } else {
            res.data ? res.message = errorFromWebSeviceCheck(res) : res.message = errorMessage[1000];
            yield put({
                type: AMBASSADOR.VERIFY_WITHDRAW_FAILURE,
                payload: res.message
            })
        }
    } catch (e) {
        const errMsg = e.data ? errorMessage[e.code] : errorMessage[4000];
        yield put({
            type: AMBASSADOR.VERIFY_WITHDRAW_FAILURE,
            payload: errMsg
        })
    }
}

function* transactionSaga() {
    yield takeLatest(AMBASSADOR.TRANSACTION_HISTORY_REQUEST, transactionHistoryTask);
    yield takeLatest(AMBASSADOR.TRANSFER_FUND_REQUEST, transferFundTask);
    yield takeLatest(AMBASSADOR.WITHDRAW_REQUEST, withdrawTask);
    yield takeLatest(AMBASSADOR.VERIFY_WITHDRAW_REQUEST, verifyWithdrawTask);
}

export default transactionSaga;