import { call, put, takeLatest } from 'redux-saga/effects';
import { AMBASSADOR } from "../../../constant";
import { doAmbassadorLoanListRequest, doApproveLoanRequest, doFetchClientLoanHistory, doFetchPendingLoan, doFetchUnderwritings, doLoanApproveTokenRequest, doPayPlanAssign, doPlayPlanListRequest, doRejectLoanRequest, doVerifyClientRequest } from '../../../service/ambassadorService/resource';
import errorMessage from "../../../utils/amb_error.json";

// check errors from web services
const errorFromWebSeviceCheck = (res) => {
    if (res.data.code == 'err68') {
        return res.data.message
    } else {
        return errorMessage[res.data.code]
    }
}

function* pendingLoanRequestTask(action) {
    try {
        yield put({ type: AMBASSADOR.PENDING_LOAN_LIST_LOADING });

        const { payload } = action;

        const res = yield call(doFetchPendingLoan, payload.token);

        if (res.status == 200) {
            yield put({
                type: AMBASSADOR.PENDING_LOAN_LIST_SUCCESS,
                payload: res.data
            })
        } else {
            res.data ? res.message = errorMessage[res.data.code] : res.message = errorMessage[1000];
            yield put({
                type: AMBASSADOR.PENDING_LOAN_LIST_FAILURE,
                payload: res.message
            })
        }
    } catch (e) {
        const errMsg = e.data ? errorMessage[e.code]  :  errorMessage[4000];
        yield put({
            type: AMBASSADOR.PENDING_LOAN_LIST_FAILURE,
            payload: errMsg
        })
    }
}

function* clientLoanHistoryTask(action) {
    try {
        yield put({ type: AMBASSADOR.CLIENT_LOAN_HISTORY_LOADING });

        const { payload } = action;

        const res = yield call(doFetchClientLoanHistory, payload.token, payload.client_id);

        if (res.status == 200) {
            yield put({
                type: AMBASSADOR.CLIENT_LOAN_HISTORY_SUCCESS,
                payload: res.data
            })
        } else {
            res.data ? res.message = errorMessage[res.data.code] : res.message = errorMessage[1000];
            yield put({
                type: AMBASSADOR.CLIENT_LOAN_HISTORY_FAILURE,
                payload: res.message
            })
        }
    } catch (e) {
        const errMsg = e.data ? errorMessage[e.code]  :  errorMessage[4000];
        yield put({
            type: AMBASSADOR.CLIENT_LOAN_HISTORY_FAILURE,
            payload: errMsg
        })
    }
}

function* approveLoanRequestTask(action) {
    try {
        yield put({ type: AMBASSADOR.APPROVE_LOAN_LOADING });

        const { payload } = action;

        const res = yield call(doApproveLoanRequest, payload.token, payload.loan_id, payload.loan_otp);

        if (res.status == 200) {
            yield put({
                type: AMBASSADOR.APPROVE_LOAN_SUCCESS,
                payload: res.data
            }) 
        } else {
            res.data ? res.message = errorFromWebSeviceCheck(res) : res.message = errorMessage[1000];
            yield put({
                type: AMBASSADOR.APPROVE_LOAN_FAILURE,
                payload: res.message
            })
        }
    } catch (e) {
        const errMsg = e.data ? errorMessage[e.code]  :  errorMessage[4000];
        yield put({
            type: AMBASSADOR.APPROVE_LOAN_FAILURE,
            payload: errMsg
        })
    }
}

function* rejectLoanRequestTask(action) {
    try {
        yield put({ type: AMBASSADOR.REJECT_LOAN_LOADING });

        const { payload } = action;

        const res = yield call(doRejectLoanRequest, payload.token, payload.loan_id, payload.remark);

        if (res.status == 200) {
            yield put({
                type: AMBASSADOR.REJECT_LOAN_SUCCESS,
                payload: res.data
            }) 
        } else {
            res.data ? res.message = errorFromWebSeviceCheck(res) : res.message = errorMessage[1000];
            yield put({
                type: AMBASSADOR.REJECT_LOAN_FAILURE,
                payload: res.message
            })
        }
    } catch (e) {
        const errMsg = e.data ? errorMessage[e.code]  :  errorMessage[4000];
        yield put({
            type: AMBASSADOR.REJECT_LOAN_FAILURE,
            payload: errMsg
        })
    }
}

function* ambassadorLoanListTask(action) {
    try {
        yield put({ type: AMBASSADOR.AMBASSADOR_LOAN_LOADING });

        const { payload } = action;

        const res = yield call(doAmbassadorLoanListRequest, payload.token, payload.loan_status);

        if (res.status == 200) {
            yield put({
                type:  AMBASSADOR.AMBASSADOR_LOAN_SUCCESS,
                payload: res.data
            });
        } else {
            res.data ? res.message = errorMessage[res.data.code] : res.message = errorMessage[1000];
            yield put({
                type: AMBASSADOR.AMBASSADOR_LOAN_FAILURE,
                payload: res.message
            })
        }
    } catch (e) {
        const errMsg = e.data ? errorMessage[e.code]  :  errorMessage[4000];
        yield put({
            type: AMBASSADOR.AMBASSADOR_LOAN_FAILURE,
            payload: errMsg
        })
    }
}

function* loanApproveTokenRequestTask(action) {
    try {
        yield put({ type: AMBASSADOR.LOAN_APPROVE_TOKEN_LOADING });

        const { payload } = action

        const res = yield call(doLoanApproveTokenRequest, payload.token, payload.loan_id);

        console.log(res);

        if (res.status == 200) {
            yield put({
                type: AMBASSADOR.LOAN_APPROVE_TOKEN_SUCCESS,
                payload: res.data
            });
        } else {
            res.data ? res.message = errorFromWebSeviceCheck(res) : res.message = errorMessage[1000];
            yield put({
                type: AMBASSADOR.LOAN_APPROVE_TOKEN_FAILURE,
                payload: res.message
            });
        }
    } catch (e) {
        const errMsg = e.data ? errorMessage[e.code]  :  errorMessage[4000];
        console.log(e);
        yield put({
            type: AMBASSADOR.LOAN_APPROVE_TOKEN_FAILURE,
            payload: errMsg
        })
    }
}

function* payPlanListTask(action) {
    try {
        yield put({ type: AMBASSADOR.PAYPLAN_LIST_LOADING });

        const { payload } = action

        const res = yield call(doPlayPlanListRequest, payload.token);

        console.log(res);

        if (res.status == 200) {
            yield put({
                type: AMBASSADOR.PAYPLAN_LIST_SUCCESS,
                payload: res.data
            });
        } else {
            res.data ? res.message = errorMessage[res.data.code] : res.message = errorMessage[1000];
            yield put({
                type: AMBASSADOR.PAYPLAN_LIST_FAILURE,
                payload: res.message
            });
        }
    } catch (e) {
        const errMsg = e.data ? errorMessage[e.code]  :  errorMessage[4000];
        console.log(e);
        yield put({
            type: AMBASSADOR.PAYPLAN_LIST_FAILURE,
            payload: errMsg
        })
    }
}

function* verifyClientTask(action) {
    try {
        yield put({ type: AMBASSADOR.VERIFY_CLIENT_LOADING });

        const { payload } = action

        const res = yield call(doVerifyClientRequest, payload.token, payload.mobile);

        console.log(res);

        if (res.status == 200) {
            yield put({
                type: AMBASSADOR.VERIFY_CLIENT_SUCCESS,
                payload: res.data
            });
        } else {
            res.data ? res.message = errorFromWebSeviceCheck(res) : res.message = errorMessage[1000];
            yield put({
                type: AMBASSADOR.VERIFY_CLIENT_FAILURE,
                payload: res.message
            });
        }
    } catch (e) {
        const errMsg = e.data ? errorMessage[e.code]  :  errorMessage[4000];
        console.log(e);
        yield put({
            type: AMBASSADOR.VERIFY_CLIENT_FAILURE,
            payload: errMsg
        })
    }
}

function* payPlanAssignTask(action) {
    try {
        yield put({ type: AMBASSADOR.PAYPLAN_ASSIGN_LOADING });

        const { payload } = action

        const res = yield call(doPayPlanAssign, payload.token, payload.payplan, payload.clients);

        console.log(res);

        if (res.status == 200) {
            yield put({
                type: AMBASSADOR.PAYPLAN_ASSIGN_SUCCESS,
                payload: res.data
            });
        } else {
            res.data ? res.message = errorMessage[res.data.code] : res.message = errorMessage[1000];
            yield put({
                type: AMBASSADOR.PAYPLAN_ASSIGN_FAILURE,
                payload: res.message
            });
        }
    } catch (e) {
        const errMsg = e.data ? errorMessage[e.code]  :  errorMessage[4000];
        console.log(e);
        yield put({
            type: AMBASSADOR.PAYPLAN_ASSIGN_FAILURE,
            payload: errMsg
        })
    }
}

function* underwritingTask(action) {
    try {
        yield put({ type: AMBASSADOR.UNDERWRITING_LOADING });

        const { payload } = action

        const res = yield call(doFetchUnderwritings, payload.token, payload.loan_id);

        console.log(res);

        if (res.status == 200) {
            yield put({
                type: AMBASSADOR.UNDERWRITING_SUCCESS,
                payload: res.data
            });
        } else {
            res.data ? res.message = errorMessage[res.data.code] : res.message = errorMessage[1000];
            yield put({
                type: AMBASSADOR.UNDERWRITING_FAILURE,
                payload: res.message
            });
        }
    } catch (e) {
        const errMsg = e.data ? errorMessage[e.code]  :  errorMessage[4000];
        console.log(e);
        yield put({
            type: AMBASSADOR.UNDERWRITING_FAILURE,
            payload: errMsg
        })
    }
}

function* resourceSaga() {
    yield takeLatest(AMBASSADOR.PENDING_LOAN_LIST_REQUEST, pendingLoanRequestTask);
    yield takeLatest(AMBASSADOR.CLIENT_LOAN_HISTORY_REQUEST, clientLoanHistoryTask);
    yield takeLatest(AMBASSADOR.APPROVE_LOAN_REQUEST, approveLoanRequestTask);
    yield takeLatest(AMBASSADOR.REJECT_LOAN_REQUEST, rejectLoanRequestTask);
    yield takeLatest(AMBASSADOR.AMBASSADOR_LOAN_REQUEST, ambassadorLoanListTask);
    yield takeLatest(AMBASSADOR.LOAN_APPROVE_TOKEN_REQUEST, loanApproveTokenRequestTask);
    yield takeLatest(AMBASSADOR.PAYPLAN_LIST_REQUEST, payPlanListTask);
    yield takeLatest(AMBASSADOR.VERIFY_CLIENT_REQUEST, verifyClientTask);
    yield takeLatest(AMBASSADOR.PAYPLAN_ASSIGN_REQUEST, payPlanAssignTask);
    yield takeLatest(AMBASSADOR.UNDERWRITING_REQUEST, underwritingTask);
}

export default resourceSaga;