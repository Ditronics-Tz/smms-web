import { call, put, takeLatest } from 'redux-saga/effects';
import { STATE } from "../../constant";
import { errorMessage } from '../../utils';
import { doAdminDetails, doInactiveUsers, doOperatorDetails, doParentDetails, doStudentDetails, doStudentEdit, doStudentList, doUserList } from '../../service/user';

/* ______ STUDENT SAGAS ________ */

// List
function* userListTask(action) {
    try {
        yield put({ type: STATE.USER_LIST_LOADING });

        const { payload } = action;

        const res = yield call(doUserList,payload.token, payload.data, payload.page);

        if (res.status == 200) {
            yield put({
                type: STATE.USER_LIST_SUCCESS,
                payload: res.data
            })
        } else {
            const errMsg = res.data ? errorMessage(res.data.code) : errorMessage(1000);
            yield put({
                type: STATE.USER_LIST_FAILURE,
                payload: errMsg
            })
        }
    } catch (e) {
        const errMsg = e.data ? errorMessage(e.code) : errorMessage(4000);
        yield put({
            type: STATE.USER_LIST_FAILURE,
            payload: errMsg
        })
    }
}

// List
function* inactiveUsersTask(action) {
    try {
        yield put({ type: STATE.INACTIVE_USERS_LOADING });

        const { payload } = action;

        const res = yield call(doInactiveUsers,payload.token, payload.data, payload.page);

        if (res.status == 200) {
            yield put({
                type: STATE.INACTIVE_USERS_SUCCESS,
                payload: res.data
            })
        } else {
            const errMsg = res.data ? errorMessage(res.data.code) : errorMessage(1000);
            yield put({
                type: STATE.INACTIVE_USERS_FAILURE,
                payload: errMsg
            })
        }
    } catch (e) {
        const errMsg = e.data ? errorMessage(e.code) : errorMessage(4000);
        yield put({
            type: STATE.INACTIVE_USERS_FAILURE,
            payload: errMsg
        })
    }
}

// student Details
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

// admin Details
function* adminDetailsTask(action) {
    try {
        yield put({ type: STATE.ADMIN_DETAILS_LOADING });

        const { payload } = action;

        const res = yield call(doAdminDetails,payload.token, payload.data);

        if (res.status == 200) {
            yield put({
                type: STATE.ADMIN_DETAILS_SUCCESS,
                payload: res.data
            })
        } else {
            const errMsg = res.data ? errorMessage(res.data.code) : errorMessage(1000);
            yield put({
                type: STATE.ADMIN_DETAILS_FAILURE,
                payload: errMsg
            })
        }
    } catch (e) {
        const errMsg = e.data ? errorMessage(e.code) : errorMessage(4000);
        yield put({
            type: STATE.ADMIN_DETAILS_FAILURE,
            payload: errMsg
        })
    }
}

// operator Details
function* operatorDetailsTask(action) {
    try {
        yield put({ type: STATE.OPERATOR_DETAILS_LOADING });

        const { payload } = action;

        const res = yield call(doOperatorDetails,payload.token, payload.data);

        if (res.status == 200) {
            yield put({
                type: STATE.OPERATOR_DETAILS_SUCCESS,
                payload: res.data
            })
        } else {
            const errMsg = res.data ? errorMessage(res.data.code) : errorMessage(1000);
            yield put({
                type: STATE.OPERATOR_DETAILS_FAILURE,
                payload: errMsg
            })
        }
    } catch (e) {
        const errMsg = e.data ? errorMessage(e.code) : errorMessage(4000);
        yield put({
            type: STATE.OPERATOR_DETAILS_FAILURE,
            payload: errMsg
        })
    }
}

// parent Details
function* parentDetailsTask(action) {
    try {
        yield put({ type: STATE.PARENT_DETAILS_LOADING });

        const { payload } = action;

        const res = yield call(doParentDetails,payload.token, payload.data);

        if (res.status == 200) {
            yield put({
                type: STATE.PARENT_DETAILS_SUCCESS,
                payload: res.data
            })
        } else {
            const errMsg = res.data ? errorMessage(res.data.code) : errorMessage(1000);
            yield put({
                type: STATE.PARENT_DETAILS_FAILURE,
                payload: errMsg
            })
        }
    } catch (e) {
        const errMsg = e.data ? errorMessage(e.code) : errorMessage(4000);
        yield put({
            type: STATE.PARENT_DETAILS_FAILURE,
            payload: errMsg
        })
    }
}



function* userSaga() {
    yield takeLatest(STATE.USER_LIST_REQUEST, userListTask);
    yield takeLatest(STATE.INACTIVE_USERS_REQUEST, inactiveUsersTask);
    yield takeLatest(STATE.STUDENT_DETAILS_REQUEST, studentDetailsTask);
    yield takeLatest(STATE.ADMIN_DETAILS_REQUEST, adminDetailsTask);
    yield takeLatest(STATE.OPERATOR_DETAILS_REQUEST, operatorDetailsTask);
    yield takeLatest(STATE.PARENT_DETAILS_REQUEST, parentDetailsTask);
}

export default userSaga;