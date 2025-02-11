import { STATE } from "../../constant";

// Create school action
export function createSchoolRequest(token, data) {
    return {
        type: STATE.CREATE_SCHOOL_REQUEST,
        payload: {
            token,
            data
        }
    }
}

export function createSchoolReset() {
    return {
        type: STATE.CREATE_SCHOOL_RESET
    }
}


// Delete school action
export function deleteSchoolRequest(token, data) {
    return {
        type: STATE.DELETE_SCHOOL_REQUEST,
        payload: {
            token,
            data
        }
    }
}

export function deleteSchoolReset() {
    return {
        type: STATE.DELETE_SCHOOL_RESET
    }
}


// school list action
export function schoolListRequest(token, data, page) {
    return {
        type: STATE.SCHOOL_LIST_REQUEST,
        payload: {
            token,
            data,
            page
        }
    }
}

export function schoolListReset() {
    return {
        type: STATE.SCHOOL_LIST_RESET
    }

}


// Create item action
export function createItemRequest(token, data) {
    return {
        type: STATE.CREATE_ITEM_REQUEST,
        payload: {
            token,
            data
        }
    }
}

export function createItemReset() {
    return {
        type: STATE.CREATE_ITEM_RESET
    }
}


// Edit item action
export function editItemRequest(token, data) {
    return {
        type: STATE.EDIT_ITEM_REQUEST,
        payload: {
            token,
            data
        }
    }
}

export function editItemReset() {
    return {
        type: STATE.EDIT_ITEM_RESET
    }
}


// item list action
export function itemListRequest(token, data, page) {
    return {
        type: STATE.ITEM_LIST_REQUEST,
        payload: {
            token,
            data,
            page
        }
    }
}

export function itemListReset() {
    return {
        type: STATE.ITEM_LIST_RESET
    }

}


// Delete item action
export function deleteItemRequest(token, data) {
    return {
        type: STATE.DELETE_ITEM_REQUEST,
        payload: {
            token,
            data
        }
    }
}

export function deleteItemReset() {
    return {
        type: STATE.DELETE_ITEM_RESET
    }
}


// Create card action
export function createCardRequest(token, data) {
    return {
        type: STATE.CREATE_CARD_REQUEST,
        payload: {
            token,
            data
        }
    }
}

export function createCardReset() {
    return {
        type: STATE.CREATE_CARD_RESET
    }
}


// Edit card action
export function editCardRequest(token, data) {
    return {
        type: STATE.EDIT_CARD_REQUEST,
        payload: {
            token,
            data
        }
    }
}

export function editCardReset() {
    return {
        type: STATE.EDIT_CARD_RESET
    }
}

// card list action
export function cardListRequest(token, data, page) {
    return {
        type: STATE.CARD_LIST_REQUEST,
        payload: {
            token,
            data,
            page
        }
    }
}

export function cardListReset() {
    return {
        type: STATE.CARD_LIST_RESET
    }

}

// card details action
export function cardDetailsRequest(token, data) {
    return {
        type: STATE.CARD_DETAILS_REQUEST,
        payload: {
            token,
            data,
        }
    }
}

export function cardDetailsReset() {
    return {
        type: STATE.CARD_DETAILS_RESET
    }

}


// Activate card action
export function activateCardRequest(token, data) {
    return {
        type: STATE.ACTIVATE_CARD_REQUEST,
        payload: {
            token,
            data
        }
    }
}

export function activateCardReset() {
    return {
        type: STATE.ACTIVATE_CARD_RESET
    }
}


