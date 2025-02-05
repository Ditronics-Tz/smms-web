import { call, put, takeLatest } from 'redux-saga/effects';
import { STATE } from "../../constant";
import { errorMessage } from '../../utils';
import { doStudentDetails, doStudentEdit, doStudentList } from '../../service/user';

/* ______ STUDENT SAGAS ________ */

// List
function* studentListTask(action) {
    try {
        yield put({ type: STATE.STUDENT_LIST_LOADING });

        const { payload } = action;

        const res = yield call(doStudentList,payload.token, payload.data, payload.page);

        if (res.status == 200) {
            yield put({
                type: STATE.STUDENT_LIST_SUCCESS,
                payload: res.data
            })
        } else {
            const errMsg = res.data ? errorMessage(res.data.code) : errorMessage(1000);
            yield put({
                type: STATE.STUDENT_LIST_FAILURE,
                payload: errMsg
            })
        }
    } catch (e) {
        const errMsg = e.data ? errorMessage(e.code) : errorMessage(4000);
        yield put({
            type: STATE.STUDENT_LIST_FAILURE,
            payload: errMsg
        })
    }
}

// Details
function* studentDetailsTask(action) {
    try {
        yield put({ type: STATE.STUDENT_DETAILS_LOADING });

        const { payload } = action;

        const res = yield call(doStudentDetails,payload.token, payload.data);

        if (res.status == 200) {
            yield put({
                type: STATE.STUDENT_DETAILS_SUCCESS,
                payload: res.data
            })
        } else {
            const errMsg = res.data ? errorMessage(res.data.code) : errorMessage(1000);
            yield put({
                type: STATE.STUDENT_DETAILS_FAILURE,
                payload: errMsg
            })
        }
    } catch (e) {
        const errMsg = e.data ? errorMessage(e.code) : errorMessage(4000);
        yield put({
            type: STATE.STUDENT_DETAILS_FAILURE,
            payload: errMsg
        })
    }
}

// Edit
function* studentEditTask(action) {
    try {
        yield put({ type: STATE.STUDENT_EDIT_LOADING });

        const { payload } = action;

        const res = yield call(doStudentEdit,payload.token, payload.data);

        if (res.status == 200) {
            yield put({
                type: STATE.STUDENT_EDIT_SUCCESS,
                payload: res.data
            })
        } else {
            const errMsg = res.data ? errorMessage(res.data.code) : errorMessage(1000);
            yield put({
                type: STATE.STUDENT_EDIT_FAILURE,
                payload: errMsg
            })
        }
    } catch (e) {
        const errMsg = e.data ? errorMessage(e.code) : errorMessage(4000);
        yield put({
            type: STATE.STUDENT_EDIT_FAILURE,
            payload: errMsg
        })
    }
}


function* userSaga() {
    yield takeLatest(STATE.STUDENT_LIST_REQUEST, studentListTask);
    yield takeLatest(STATE.STUDENT_DETAILS_REQUEST, studentDetailsTask);
    yield takeLatest(STATE.STUDENT_EDIT_REQUEST, studentEditTask);
}

export default userSaga;