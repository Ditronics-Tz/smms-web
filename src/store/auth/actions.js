import { STATE } from "../../constant";

// Create user action
export function createUserRequest(token, data) {
    return {
        type: STATE.CREATE_USER_REQUEST,
        payload: {
            token,
            data
        }
    }
}

export function createUserReset() {
    return {
        type: STATE.CREATE_USER_RESET
    }
}

// Edit user action
export function editUserRequest(token, data) {
    return {
        type: STATE.EDIT_USER_REQUEST,
        payload: {
            token,
            data
        }
    }
}

export function editUserReset() {
    return {
        type: STATE.EDIT_USER_RESET
    }
}


// Activate/deactivate user action
export function activateUserRequest(token, data) {
    return {
        type: STATE.ACTIVATE_USER_REQUEST,
        payload: {
            token,
            data
        }
    }
}

export function activateUserReset() {
    return {
        type: STATE.ACTIVATE_USER_RESET
    }
}

// login action
export function loginRequest(data) {
    return {
        type: STATE.LOGIN_REQUEST,
        payload: {
            data
        }
    }
    
}

export function loginReset (){
    return {
        type: STATE.LOGIN_RESET
    }
}

// logout action
export function logoutRequest (data){
    return {
        type: STATE.LOGIN_RESET,
        payload: {
            data
        }

    }
}


// token request action
export function tokenRequest(data){
    return {
        type: STATE.TOKEN_REQUEST,
        payload: {
            data
        }
    }
}

export function tokenReset(){
    return {
        type: STATE.TOKEN_RESET
    }
}
