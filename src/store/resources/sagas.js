import { call, put, takeLatest } from 'redux-saga/effects';
import { STATE } from "../../constant";
import { doCreateSchool, doSchoolList, doCreateCard, doCardList, doCreateItem, doItemList, doCardDetails, doDeleteItem, doDeleteSchool, doEditCard, doEditItem, doActivateCard } from '../../service/resources';
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

// School List
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

// Delete school
function* deleteSchoolTask(action) {
    try {
        yield put({ type: STATE.DELETE_SCHOOL_LOADING });

        const { payload } = action;

        const res = yield call(doDeleteSchool,payload.token, payload.data);

        if (res.status == 200) {
            yield put({
                type: STATE.DELETE_SCHOOL_SUCCESS,
                payload: res.data
            })
        } else {
            const errMsg = res.data ? errorMessage(res.data.code) : errorMessage(1000);
            yield put({
                type: STATE.DELETE_SCHOOL_FAILURE,
                payload: errMsg
            })
        }
    } catch (e) {
        const errMsg = e.data ? errorMessage(e.code) : errorMessage(4000);
        yield put({
            type: STATE.DELETE_SCHOOL_FAILURE,
            payload: errMsg
        })
    }
}

// Create item
function* createItemTask(action) {
    try {
        yield put({ type: STATE.CREATE_ITEM_LOADING });

        const { payload } = action;

        const res = yield call(doCreateItem,payload.token, payload.data);

        if (res.status == 201) {
            yield put({
                type: STATE.CREATE_ITEM_SUCCESS,
                payload: res.data
            })
        } else {
            const errMsg = res.data ? errorMessage(res.data.code) : errorMessage(1000);
            yield put({
                type: STATE.CREATE_ITEM_FAILURE,
                payload: errMsg
            })
        }
    } catch (e) {
        const errMsg = e.data ? errorMessage(e.code) : errorMessage(4000);
        yield put({
            type: STATE.CREATE_ITEM_FAILURE,
            payload: errMsg
        })
    }
}

// Edit item
function* editItemTask(action) {
    try {
        yield put({ type: STATE.EDIT_ITEM_LOADING });

        const { payload } = action;

        const res = yield call(doEditItem,payload.token, payload.data);

        if (res.status == 200) {
            yield put({
                type: STATE.EDIT_ITEM_SUCCESS,
                payload: res.data
            })
        } else {
            const errMsg = res.data ? errorMessage(res.data.code) : errorMessage(1000);
            yield put({
                type: STATE.EDIT_ITEM_FAILURE,
                payload: errMsg
            })
        }
    } catch (e) {
        const errMsg = e.data ? errorMessage(e.code) : errorMessage(4000);
        yield put({
            type: STATE.EDIT_ITEM_FAILURE,
            payload: errMsg
        })
    }
}

// Delete item
function* deleteItemTask(action) {
    try {
        yield put({ type: STATE.DELETE_ITEM_LOADING });

        const { payload } = action;

        const res = yield call(doDeleteItem,payload.token, payload.data);

        if (res.status == 200) {
            yield put({
                type: STATE.DELETE_ITEM_SUCCESS,
                payload: res.data
            })
        } else {
            const errMsg = res.data ? errorMessage(res.data.code) : errorMessage(1000);
            yield put({
                type: STATE.DELETE_ITEM_FAILURE,
                payload: errMsg
            })
        }
    } catch (e) {
        const errMsg = e.data ? errorMessage(e.code) : errorMessage(4000);
        yield put({
            type: STATE.DELETE_ITEM_FAILURE,
            payload: errMsg
        })
    }
}

// Item List
function* itemListTask(action) {
    try {
        yield put({ type: STATE.ITEM_LIST_LOADING });

        const { payload } = action;

        const res = yield call(doItemList,payload.token, payload.data, payload.page);

        if (res.status == 200) {
            yield put({
                type: STATE.ITEM_LIST_SUCCESS,
                payload: res.data
            })
        } else {
            const errMsg = res.data ? errorMessage(res.data.code) : errorMessage(1000);
            yield put({
                type: STATE.ITEM_LIST_FAILURE,
                payload: errMsg
            })
        }
    } catch (e) {
        const errMsg = e.data ? errorMessage(e.code) : errorMessage(4000);
        yield put({
            type: STATE.ITEM_LIST_FAILURE,
            payload: errMsg
        })
    }
}


// Create card
function* createCardTask(action) {
    try {
        yield put({ type: STATE.CREATE_CARD_LOADING });

        const { payload } = action;

        const res = yield call(doCreateCard,payload.token, payload.data);

        if (res.status == 200) {
            yield put({
                type: STATE.CREATE_CARD_SUCCESS,
                payload: res.data
            })
        } else {
            const errMsg = res.data ? errorMessage(res.data.code) : errorMessage(1000);
            yield put({
                type: STATE.CREATE_CARD_FAILURE,
                payload: errMsg
            })
        }
    } catch (e) {
        const errMsg = e.data ? errorMessage(e.code) : errorMessage(4000);
        yield put({
            type: STATE.CREATE_CARD_FAILURE,
            payload: errMsg
        })
    }
}

// Edit card
function* editCardTask(action) {
    try {
        yield put({ type: STATE.EDIT_CARD_LOADING });

        const { payload } = action;

        const res = yield call(doEditCard,payload.token, payload.data);

        if (res.status == 200) {
            yield put({
                type: STATE.EDIT_CARD_SUCCESS,
                payload: res.data
            })
        } else {
            const errMsg = res.data ? errorMessage(res.data.code) : errorMessage(1000);
            yield put({
                type: STATE.EDIT_CARD_FAILURE,
                payload: errMsg
            })
        }
    } catch (e) {
        const errMsg = e.data ? errorMessage(e.code) : errorMessage(4000);
        yield put({
            type: STATE.EDIT_CARD_FAILURE,
            payload: errMsg
        })
    }
}

// Activate card
function* activateCardTask(action) {
    try {
        yield put({ type: STATE.ACTIVATE_CARD_LOADING });

        const { payload } = action;

        const res = yield call(doActivateCard,payload.token, payload.data);

        if (res.status == 200) {
            yield put({
                type: STATE.ACTIVATE_CARD_SUCCESS,
                payload: res.data
            })
        } else {
            const errMsg = res.data ? errorMessage(res.data.code) : errorMessage(1000);
            yield put({
                type: STATE.ACTIVATE_CARD_FAILURE,
                payload: errMsg
            })
        }
    } catch (e) {
        const errMsg = e.data ? errorMessage(e.code) : errorMessage(4000);
        yield put({
            type: STATE.ACTIVATE_CARD_FAILURE,
            payload: errMsg
        })
    }
}

// Card List
function* cardListTask(action) {
    try {
        yield put({ type: STATE.CARD_LIST_LOADING });

        const { payload } = action;

        const res = yield call(doCardList,payload.token, payload.data, payload.page);

        if (res.status == 200) {
            yield put({
                type: STATE.CARD_LIST_SUCCESS,
                payload: res.data
            })
        } else {
            const errMsg = res.data ? errorMessage(res.data.code) : errorMessage(1000);
            yield put({
                type: STATE.CARD_LIST_FAILURE,
                payload: errMsg
            })
        }
    } catch (e) {
        const errMsg = e.data ? errorMessage(e.code) : errorMessage(4000);
        yield put({
            type: STATE.CARD_LIST_FAILURE,
            payload: errMsg
        })
    }
}

// Card Details
function* cardDetailsTask(action) {
    try {
        yield put({ type: STATE.CARD_DETAILS_LOADING });

        const { payload } = action;

        const res = yield call(doCardDetails,payload.token, payload.data, payload.page);

        if (res.status == 200) {
            yield put({
                type: STATE.CARD_DETAILS_SUCCESS,
                payload: res.data
            })
        } else {
            const errMsg = res.data ? errorMessage(res.data.code) : errorMessage(1000);
            yield put({
                type: STATE.CARD_DETAILS_FAILURE,
                payload: errMsg
            })
        }
    } catch (e) {
        const errMsg = e.data ? errorMessage(e.code) : errorMessage(4000);
        yield put({
            type: STATE.CARD_DETAILS_FAILURE,
            payload: errMsg
        })
    }
}


function* resourcesSaga() {
    yield takeLatest(STATE.CREATE_SCHOOL_REQUEST, createSchoolTask)
    yield takeLatest(STATE.DELETE_SCHOOL_REQUEST, deleteSchoolTask)
    yield takeLatest(STATE.SCHOOL_LIST_REQUEST, schoolListTask);
    yield takeLatest(STATE.CREATE_ITEM_REQUEST, createItemTask)
    yield takeLatest(STATE.DELETE_ITEM_REQUEST, deleteItemTask)
    yield takeLatest(STATE.EDIT_ITEM_REQUEST, editItemTask)
    yield takeLatest(STATE.ITEM_LIST_REQUEST, itemListTask);
    yield takeLatest(STATE.CREATE_CARD_REQUEST, createCardTask)
    yield takeLatest(STATE.EDIT_CARD_REQUEST, editCardTask)
    yield takeLatest(STATE.ACTIVATE_CARD_REQUEST, activateCardTask)
    yield takeLatest(STATE.CARD_LIST_REQUEST, cardListTask);
    yield takeLatest(STATE.CARD_DETAILS_REQUEST, cardDetailsTask);
}

export default resourcesSaga