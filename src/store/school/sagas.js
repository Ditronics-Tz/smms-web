import { call, put, takeLatest } from 'redux-saga/effects';
import { STATE } from "../../constant";
import { doCreateSchool, doSchoolList } from '../../service/school';
import { errorMessage } from '../../utils';

// Create school
function* createSchoolTask(action) {
    try {
        yield put({ type: STATE.CREATE_SCHOOL_LOADING });

        const { payload } = action;

        const res = yield call(doCreateSchool,payload.token, payload.data);

        if (res.status == 201) {
            yield put({
                type: STATE.CREATE_SCHOOL_SUCCESS,
                payload: res.data
            })
        } else {
            const errMsg = res.data ? errorMessage(res.data.code) : errorMessage(1000);
            yield put({
                type: STATE.CREATE_SCHOOL_FAILURE,
                payload: errMsg
            })
        }
    } catch (e) {
        const errMsg = e.data ? errorMessage(e.code) : errorMessage(4000);
        yield put({
            type: STATE.CREATE_SCHOOL_FAILURE,
            payload: errMsg
        })
    }
}

// List
function* schoolListTask(action) {
    try {
        yield put({ type: STATE.SCHOOL_LIST_LOADING });

        const { payload } = action;

        const res = yield call(doSchoolList,payload.token, payload.data, payload.page);

        if (res.status == 200) {
            yield put({
                type: STATE.SCHOOL_LIST_SUCCESS,
                payload: res.data
            })
        } else {
            const errMsg = res.data ? errorMessage(res.data.code) : errorMessage(1000);
            yield put({
                type: STATE.SCHOOL_LIST_FAILURE,
                payload: errMsg
            })
        }
    } catch (e) {
        const errMsg = e.data ? errorMessage(e.code) : errorMessage(4000);
        yield put({
            type: STATE.SCHOOL_LIST_FAILURE,
            payload: errMsg
        })
    }
}

function* schoolSaga() {
    yield takeLatest(STATE.CREATE_SCHOOL_REQUEST, createSchoolTask)
    yield takeLatest(STATE.SCHOOL_LIST_REQUEST, schoolListTask);
}

export default schoolSaga