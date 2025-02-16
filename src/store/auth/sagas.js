import { call, put, takeLatest } from 'redux-saga/effects';
import { STATE } from "../../constant";
import { doActivateUser, doCreateUser, doEditUser, doLogin, doRefreshToken } from '../../service/auth';
import { errorMessage } from '../../utils';

// login
function* loginTask(action) {
    try {
        yield put({ type: STATE.LOGIN_LOADING });

        const { payload } = action;

        const res = yield call(doLogin, payload.data);

        if (res.status === 200) {
            yield put({
                type: STATE.LOGIN_SUCCESS,
                payload: res.data
            })
        } else {
            const errMsg = res.data ? errorMessage(res.data.code) : errorMessage(1000);
            yield put({
                type: STATE.LOGIN_FAILURE,
                payload: errMsg
            })
        }
    } catch (e) {
        const errMsg = e.data ? errorMessage(e.code) : errorMessage(4000);
        yield put({
            type: STATE.LOGIN_FAILURE,
            payload: errMsg
        })
    }
}

// token 
function* tokenTask(action) {
    try {
        yield put({ type: STATE.TOKEN_LOADING });

        const { payload } = action;

        const res = yield call(doRefreshToken, payload.data);

        if (res.status === 200) {
            yield put({
                type: STATE.TOKEN_SUCCESS,
                payload: res.data
            })
        } else {
            const errMsg = res.data ? res.data.message : errorMessage(1000);
            yield put({
                type: STATE.TOKEN_FAILURE,
                payload: errMsg
            })
        }
    } catch (e) {
        const errMsg = e.data ? errorMessage(e.code) : errorMessage(4000);
        yield put({
            type: STATE.TOKEN_FAILURE,
            payload: errMsg
        })
    }
}

// Create user
function* createUserTask(action) {
    try {
        yield put({ type: STATE.CREATE_USER_LOADING });

        const { payload } = action;

        const res = yield call(doCreateUser,payload.token, payload.data);

        if (res.status === 201) {
            yield put({
                type: STATE.CREATE_USER_SUCCESS,
                payload: res.data
            })
        } else {
            const errMsg = res.data ? errorMessage(res.data.code) : errorMessage(1000);
            yield put({
                type: STATE.CREATE_USER_FAILURE,
                payload: errMsg
            })
        }
    } catch (e) {
        const errMsg = e.data ? errorMessage(e.code) : errorMessage(4000);
        yield put({
            type: STATE.CREATE_USER_FAILURE,
            payload: errMsg
        })
    }
}

// Edit user
function* editUserTask(action) {
    try {
        yield put({ type: STATE.EDIT_USER_LOADING });

        const { payload } = action;

        const res = yield call(doEditUser,payload.token, payload.data);

        if (res.status === 200) {
            yield put({
                type: STATE.EDIT_USER_SUCCESS,
                payload: res.data
            })
        } else {
            const errMsg = res.data ? errorMessage(res.data.code) : errorMessage(1000);
            yield put({
                type: STATE.EDIT_USER_FAILURE,
                payload: errMsg
            })
        }
    } catch (e) {
        const errMsg = e.data ? errorMessage(e.code) : errorMessage(4000);
        yield put({
            type: STATE.EDIT_USER_FAILURE,
            payload: errMsg
        })
    }
}

// Activate user
function* activateUserTask(action) {
    try {
        yield put({ type: STATE.ACTIVATE_USER_LOADING });

        const { payload } = action;

        const res = yield call(doActivateUser,payload.token, payload.data);

        if (res.status === 200) {
            yield put({
                type: STATE.ACTIVATE_USER_SUCCESS,
                payload: res.data
            })
        } else {
            const errMsg = res.data ? errorMessage(res.data.code) : errorMessage(1000);
            yield put({
                type: STATE.ACTIVATE_USER_FAILURE,
                payload: errMsg
            })
        }
    } catch (e) {
        const errMsg = e.data ? errorMessage(e.code) : errorMessage(4000);
        yield put({
            type: STATE.ACTIVATE_USER_FAILURE,
            payload: errMsg
        })
    }
}


function* authSaga() {
    yield takeLatest(STATE.LOGIN_REQUEST, loginTask);
    yield takeLatest(STATE.TOKEN_REQUEST, tokenTask);
    yield takeLatest(STATE.CREATE_USER_REQUEST, createUserTask);
    yield takeLatest(STATE.EDIT_USER_REQUEST, editUserTask);
    yield takeLatest(STATE.ACTIVATE_USER_REQUEST, activateUserTask);
}

export default authSaga;