import { STATE } from "../../constant";

/* _________________ USER ACTIONS _______________ */
// user list action
export function userListRequest(token, data, page) {
    return {
        type: STATE.USER_LIST_REQUEST,
        payload: {
            token,
            data,
            page
        }
    }
}

export function userListReset() {
    return {
        type: STATE.USER_LIST_RESET
    }

}

// inactive user list action
export function inactiveUserRequest(token, data, page) {
    return {
        type: STATE.INACTIVE_USERS_REQUEST,
        payload: {
            token,
            data,
            page
        }
    }
}

export function inactiveUserReset() {
    return {
        type: STATE.INACTIVE_USERS_RESET
    }

}

// student details action
export function studentDetailsRequest(token, data){
    return {
        type: STATE.STUDENT_DETAILS_REQUEST,
        payload: {
            token,
            data
        }
    }
}

export function studentDetailsReset(){
    return {
        type: STATE.STUDENT_DETAILS_RESET
    }
}

// admin details action
export function adminDetailsRequest(token, data){
    return {
        type: STATE.ADMIN_DETAILS_REQUEST,
        payload: {
            token,
            data
        }
    }
}

export function adminDetailsReset(){
    return {
        type: STATE.ADMIN_DETAILS_RESET
    }
}

// operator details action
export function operatorDetailsRequest(token, data){
    return {
        type: STATE.OPERATOR_DETAILS_REQUEST,
        payload: {
            token,
            data
        }
    }
}

export function operatorDetailsReset(){
    return {
        type: STATE.OPERATOR_DETAILS_RESET
    }
}

// parent details action
export function parentDetailsRequest(token, data){
    return {
        type: STATE.PARENT_DETAILS_REQUEST,
        payload: {
            token,
            data
        }
    }
}

export function parentDetailsReset(){
    return {
        type: STATE.PARENT_DETAILS_RESET
    }
}
