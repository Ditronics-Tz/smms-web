import { call, put, takeLatest } from 'redux-saga/effects';
import { STATE } from "../../constant";
import { doActivateUser, doChangePassword, doConfirmPasswordReset, doCreateUser, doEditUser, doForgotPassword, doImportCommit, doImportPreview, doLogin, doRefreshToken } from '../../service/auth';
import { errorMessage, setRefreshToken, setCachedUser, getCachedUser, clearAllClientStorage } from '../../utils';

// login
function* loginTask(action) {
    try {
        yield put({ type: STATE.LOGIN_LOADING });

        const { payload } = action;

        const res = yield call(doLogin, payload.data);

        if (res.status === 200) {
            setRefreshToken(res.data.refresh);
            setCachedUser(res.data.user);
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
            // A refresh may or may not rotate the refresh token; only overwrite
            // the stored one when the backend actually issued a new one.
            if (res.data.refresh) setRefreshToken(res.data.refresh);
            yield put({
                type: STATE.TOKEN_SUCCESS,
                payload: { ...res.data, restored_user: getCachedUser() }
            })
        } else {
            const errMsg = res.data ? res.data.message : errorMessage(1000);
            clearAllClientStorage();
            yield put({
                type: STATE.TOKEN_FAILURE,
                payload: errMsg
            })
        }
    } catch (e) {
        const errMsg = e.data ? errorMessage(e.code) : errorMessage(4000);
        clearAllClientStorage();
        yield put({
            type: STATE.TOKEN_FAILURE,
            payload: errMsg
        })
    }
}

// Logout: drop the refresh token and the persisted slices so nothing about the
// previous session survives in web storage.
// eslint-disable-next-line require-yield
function* logoutTask() {
    clearAllClientStorage();
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


// forgot password
function* forgotPasswordTask(action) {
    try {
        yield put({ type: STATE.FORGOT_PASSWORD_LOADING });

        const { payload } = action;

        const res = yield call(doForgotPassword, payload.data);

        if (res.status === 200) {
            yield put({
                type: STATE.FORGOT_PASSWORD_SUCCESS,
                payload: res.data
            })
        } else {
            const errMsg = res.data ? errorMessage(res.data.code) : errorMessage(1000);
            yield put({
                type: STATE.FORGOT_PASSWORD_FAILURE,
                payload: errMsg
            })
        }
    } catch (e) {
        const errMsg = e.data ? errorMessage(e.code) : errorMessage(4000);
        yield put({
            type: STATE.FORGOT_PASSWORD_FAILURE,
            payload: errMsg
        })
    }
}

// confirm a password reset from the emailed link
function* confirmPasswordResetTask(action) {
    try {
        yield put({ type: STATE.RESET_PASSWORD_CONFIRM_LOADING });

        const { payload } = action;

        const res = yield call(doConfirmPasswordReset, payload.data);

        if (res.status === 200 || res.status === 201) {
            yield put({
                type: STATE.RESET_PASSWORD_CONFIRM_SUCCESS,
                payload: res.data
            })
        } else {
            const errMsg = res.data ? errorMessage(res.data.code) : errorMessage(1000);
            yield put({
                type: STATE.RESET_PASSWORD_CONFIRM_FAILURE,
                payload: errMsg
            })
        }
    } catch (e) {
        const errMsg = e.data ? errorMessage(e.code) : errorMessage(4000);
        yield put({
            type: STATE.RESET_PASSWORD_CONFIRM_FAILURE,
            payload: errMsg
        })
    }
}

// change password
function* changePasswordTask(action) {
    try {
        yield put({ type: STATE.CHANGE_PASSWORD_LOADING });

        const { payload } = action;

        const res = yield call(doChangePassword, payload.token, payload.data);

        if (res.status === 200) {
            yield put({
                type: STATE.CHANGE_PASSWORD_SUCCESS,
                payload: res.data
            })
        } else {
            const errMsg = res.data ? errorMessage(res.data.code) : errorMessage(1000);
            yield put({
                type: STATE.CHANGE_PASSWORD_FAILURE,
                payload: errMsg
            })
        }
    } catch (e) {
        const errMsg = e.data ? errorMessage(e.code) : errorMessage(4000);
        yield put({
            type: STATE.CHANGE_PASSWORD_FAILURE,
            payload: errMsg
        })
    }
}

// Import students preview
function* importPreviewTask(action) {
    try {
        yield put({ type: STATE.IMPORT_PREVIEW_LOADING });

        const { payload } = action;

        const res = yield call(doImportPreview,payload.token, payload.data);

        if (res.status === 200 || res.status === 201) {
            yield put({
                type: STATE.IMPORT_PREVIEW_SUCCESS,
                payload: res.data
            })
        } else {
            const errMsg = res.data ? errorMessage(res.data.code) : errorMessage(1000);
            yield put({
                type: STATE.IMPORT_PREVIEW_FAILURE,
                payload: errMsg
            })
        }
    } catch (e) {
        const errMsg = e.data ? errorMessage(e.code) : errorMessage(4000);
        yield put({
            type: STATE.IMPORT_PREVIEW_FAILURE,
            payload: errMsg
        })
    }
}

// Import students commit
function* importCommitTask(action) {
    try {
        yield put({ type: STATE.IMPORT_COMMIT_LOADING });

        const { payload } = action;

        const res = yield call(doImportCommit,payload.token, payload.data);

        if (res.status === 200 || res.status === 201) {
            yield put({
                type: STATE.IMPORT_COMMIT_SUCCESS,
                payload: res.data
            })
        } else {
            const errMsg = res.data ? errorMessage(res.data.code) : errorMessage(1000);
            yield put({
                type: STATE.IMPORT_COMMIT_FAILURE,
                payload: errMsg
            })
        }
    } catch (e) {
        const errMsg = e.data ? errorMessage(e.code) : errorMessage(4000);
        yield put({
            type: STATE.IMPORT_COMMIT_FAILURE,
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
    yield takeLatest(STATE.FORGOT_PASSWORD_REQUEST, forgotPasswordTask);
    yield takeLatest(STATE.RESET_PASSWORD_CONFIRM_REQUEST, confirmPasswordResetTask);
    yield takeLatest(STATE.CHANGE_PASSWORD_REQUEST, changePasswordTask);
    yield takeLatest(STATE.IMPORT_PREVIEW_REQUEST, importPreviewTask);
    yield takeLatest(STATE.IMPORT_COMMIT_REQUEST, importCommitTask);
    yield takeLatest(STATE.LOGIN_RESET, logoutTask);
}

export default authSaga;