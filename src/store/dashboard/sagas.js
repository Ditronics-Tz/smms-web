import { call, put, takeLatest } from 'redux-saga/effects';
import { STATE } from "../../constant";
import { errorMessage } from '../../utils';
import { doCounts, doSalesSummary, doSalesTrend } from '../../service/dashboard';

// Counts
function* countsTask(action) {
    try {
        yield put({ type: STATE.COUNTS_LOADING });

        const { payload } = action;

        const res = yield call(doCounts,payload.token, payload.data);

        if (res.status === 200) {
            yield put({
                type: STATE.COUNTS_SUCCESS,
                payload: res.data
            })
        } else {
            const errMsg = res.data ? errorMessage(res.data.code) : errorMessage(1000);
            yield put({
                type: STATE.COUNTS_FAILURE,
                payload: errMsg
            })
        }
    } catch (e) {
        const errMsg = e.data ? errorMessage(e.code) : errorMessage(4000);
        yield put({
            type: STATE.COUNTS_FAILURE,
            payload: errMsg
        })
    }
}

// Start Session
function* salesSummaryTask(action) {
    try {
        yield put({ type: STATE.SALES_SUMMARY_LOADING });

        const { payload } = action;

        const res = yield call(doSalesSummary,payload.token, payload.data);

        if (res.status === 200) {
            yield put({
                type: STATE.SALES_SUMMARY_SUCCESS,
                payload: res.data
            })
        } else {
            const errMsg = res.data ? errorMessage(res.data.code) : errorMessage(1000);
            yield put({
                type: STATE.SALES_SUMMARY_FAILURE,
                payload: errMsg
            })
        }
    } catch (e) {
        const errMsg = e.data ? errorMessage(e.code) : errorMessage(4000);
        yield put({
            type: STATE.SALES_SUMMARY_FAILURE,
            payload: errMsg
        })
    }
}

// end Session
function* salesTrendTask(action) {
    try {
        yield put({ type: STATE.SALES_TREND_LOADING });

        const { payload } = action;

        const res = yield call(doSalesTrend,payload.token, payload.data);

        if (res.status === 200) {
            yield put({
                type: STATE.SALES_TREND_SUCCESS,
                payload: res.data
            })
        } else {
            const errMsg = res.data ? errorMessage(res.data.code) : errorMessage(1000);
            yield put({
                type: STATE.SALES_TREND_FAILURE,
                payload: errMsg
            })
        }
    } catch (e) {
        const errMsg = e.data ? errorMessage(e.code) : errorMessage(4000);
        yield put({
            type: STATE.SALES_TREND_FAILURE,
            payload: errMsg
        })
    }
}



function* dashboardSaga() {
    yield takeLatest(STATE.COUNTS_REQUEST, countsTask);
    yield takeLatest(STATE.SALES_SUMMARY_REQUEST, salesSummaryTask);
    yield takeLatest(STATE.SALES_TREND_REQUEST, salesTrendTask); 
}

export default dashboardSaga