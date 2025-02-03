import { call, put, takeLatest } from "redux-saga/effects";
import { AMBASSADOR } from "../../../constant";
import { doFetchAmbassadorProfile } from "../../../service/ambassadorService/profile";
import errorMessage from "../../../utils/amb_error.json";


function* fetchAmbassadorProfileTask(action) {
    try {
        yield put({ type: AMBASSADOR.PROFILE_DETAILS_LOADING });

        const { payload } = action;

        const res = yield call(doFetchAmbassadorProfile, payload.token);

        if (res.status === 200) {
            yield put({
                type: AMBASSADOR.PROFILE_DETAILS_SUCCESS,
                payload: res.data
            });
        } else {
            res.data ? res.message = errorMessage[res.data.code] : res.message = errorMessage[1000];
            yield put({
                type: AMBASSADOR.PROFILE_DETAILS_FAILURE,
                payload: res.message
            })
        }

    } catch (e) {
        const errMsg = e.data ? errorMessage[e.code]  :  errorMessage[4000];
        yield put({
            type: AMBASSADOR.PROFILE_DETAILS_FAILURE,
            payload: errMsg
        })
    }
}

function* profileSaga() {
    yield takeLatest(AMBASSADOR.PROFILE_DETAILS_REQUEST, fetchAmbassadorProfileTask);
}

export default profileSaga;