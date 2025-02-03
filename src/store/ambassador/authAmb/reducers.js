import { AMBASSADOR, STATUS } from "../../../constant";

const INITIAL_STATE = {
    userLoginStatus: STATUS.DEFAULT,
    userLoginResult: null,
    userLoginErrorMessage: "",

    otpStatus: STATUS.DEFAULT,
    otpResult: null,
    otpErrorMessage: ""
}

export default (state = INITIAL_STATE, {type, payload}) => {
    switch (type) {
        // LOGIN
        case AMBASSADOR.LOGIN_LOADING:
            return {
                ...state,
                userLoginStatus: STATUS.LOADING
            }
        case AMBASSADOR.LOGIN_SUCCESS:
            return {
                ...state,
                userLoginStatus: STATUS.SUCCESS,
                userLoginResult: payload,
                userLoginErrorMessage: ""
            }
        case AMBASSADOR.LOGIN_FAILURE:
            return {
                ...state,
                userLoginStatus: STATUS.ERROR,
                userLoginResult: null,
                userLoginErrorMessage: payload
            }
        case AMBASSADOR.LOGIN_RESET:
            return {
                ...state,
                userLoginStatus: STATUS.DEFAULT,
                userLoginResult: null,
                userLoginErrorMessage: ""
            } 
            
            // OTP
            case AMBASSADOR.AMBASSADOR_OTP_LOADING:
                return {
                    ...state,
                    otpStatus: STATUS.LOADING
                }
            case AMBASSADOR.AMBASSADOR_OTP_SUCCESS:
                return {
                    ...state,
                    otpStatus: STATUS.SUCCESS,
                    otpResult: payload,
                    otpErrorMessage: ""
                }
            case AMBASSADOR.AMBASSADOR_OTP_FAILURE:
                return {
                    ...state,
                    otpStatus: STATUS.ERROR,
                    otpResult: null,
                    otpErrorMessage: payload
                }
            case AMBASSADOR.AMBASSADOR_OTP_RESET:
                return {
                    ...state,
                    otpStatus: STATUS.DEFAULT,
                    otpResult: null,
                    otpErrorMessage: ""
                } 
        default:
            return state;
    }
}