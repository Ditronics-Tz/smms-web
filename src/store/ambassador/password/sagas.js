import { call, put, takeLatest } from "redux-saga/effects";
import { AMBASSADOR } from "../../../constant";
import { doPasswordChange } from "../../../service/ambassadorService/password";
import errorMessage from "../../../utils/amb_error.json";

function* passwordChangeTask(action) {
    try {
        yield put({ type: AMBASSADOR.PASSWORD_CHANGE_LOADING });

        const { payload } = action;

        const res = yield call(doPasswordChange, payload.token, payload.old_pass, payload.new_pass, payload.confirm_pass);

        if (res.status == 200) {
            yield put({
                type: AMBASSADOR.PASSWORD_CHANGE_SUCCESS,
                payload: res.data
            });
        } else {
            res.data ? res.message = errorMessage[res.data.code] : res.message = errorMessage[1000];
            yield put({
                type: AMBASSADOR.PASSWORD_CHANGE_FAILURE,
                payload: res.message
            })
        }
    } catch (e) {
        const errMsg = e.data ? errorMessage[e.code] : errorMessage[4000];
        yield put({
            type: AMBASSADOR.PASSWORD_CHANGE_FAILURE,
            payload: errMsg
        })
    }
}

function* passwordSaga() {
    yield takeLatest(AMBASSADOR.PASSWORD_CHANGE_REQUEST, passwordChangeTask);
}

export default passwordSaga;