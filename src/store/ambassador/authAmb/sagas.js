import { call, put, takeLatest } from 'redux-saga/effects';
import { AMBASSADOR } from "../../../constant";
import { doUserLogin, doVerifyOTP } from '../../../service/ambassadorService/auth';
import errorMessage from '../../../utils/amb_error.json';


function* userLoginTask(action) {
    try {
        yield put({ type: AMBASSADOR.LOGIN_LOADING });

        const { payload } = action;

        const res = yield call(doUserLogin, payload.username, payload.password);

        if (res.status == 200) {
            yield put({
                type: AMBASSADOR.LOGIN_SUCCESS,
                payload: res.data
            })
        } else {
            res.data ? res.message = errorMessage[res.data.code] : res.message = errorMessage[1000];
            yield put({
                type: AMBASSADOR.LOGIN_FAILURE,
                payload: res.message
            })
        }
    } catch (e) {
        const errMsg = e.data ? errorMessage[e.code] : errorMessage[4000];
        yield put({
            type: AMBASSADOR.LOGIN_FAILURE,
            payload: errMsg
        })
    }
}

function* otpVerifyTask(action) {
    try {
        yield put({ type: AMBASSADOR.AMBASSADOR_OTP_LOADING });

        const { payload } = action;

        const res = yield call(doVerifyOTP, payload.username, payload.OTP);

        if (res.status == 200) {
            yield put({
                type: AMBASSADOR.AMBASSADOR_OTP_SUCCESS,
                payload: res.data
            })
        } else {
            res.data ? res.message = errorMessage[res.data.code] : res.message = errorMessage[1000];
            yield put({
                type: AMBASSADOR.AMBASSADOR_OTP_FAILURE,
                payload: res.message
            })
        }
    } catch (e) {
        const errMsg = e.data ? errorMessage[e.code] : errorMessage[4000];
        yield put({
            type: AMBASSADOR.AMBASSADOR_OTP_FAILURE,
            payload: errMsg
        })
    }
}

function* authSaga() {
    yield takeLatest(AMBASSADOR.LOGIN_REQUEST, userLoginTask);
    yield takeLatest(AMBASSADOR.AMBASSADOR_OTP_REQUEST, otpVerifyTask);
}

export default authSaga;