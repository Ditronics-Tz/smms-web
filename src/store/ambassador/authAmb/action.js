import { AMBASSADOR } from "../../../constant";

export function userLoginRequest(username, password) {
    return {
        type: AMBASSADOR.LOGIN_REQUEST,
        payload: {
            username,
            password
        }
    }
    
}



export function userLoginReset (){
    return {
        type: AMBASSADOR.LOGIN_RESET
    }
}

export function userLogoutRequest (){
    return {
        type: AMBASSADOR.AMBASSADOR_OTP_RESET
    }
}

export function ambassadorOTPRequest(username, OTP){
    return {
        type: AMBASSADOR.AMBASSADOR_OTP_REQUEST,
        payload: {
            username,
            OTP
        }
    }
}

export function ambassadorOTPReset(){
    return {
        type: AMBASSADOR.AMBASSADOR_OTP_RESET
    }
}
