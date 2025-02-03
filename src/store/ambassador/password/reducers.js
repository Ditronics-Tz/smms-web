import { AMBASSADOR , STATUS} from "../../../constant"

const INITIAL_STATE = {
    passwordChangeStatus: STATUS.DEFAULT,
    passwordChangeResult: null,
    passwordChangeErrorMessage: ""
}

export default (state = INITIAL_STATE, {type, payload}) => {
    switch (type) {
        case AMBASSADOR.PASSWORD_CHANGE_LOADING:
            return {
                ...state,
                passwordChangeStatus: STATUS.LOADING
            }
        case AMBASSADOR.PASSWORD_CHANGE_SUCCESS:
            return {
                ...state,
                passwordChangeStatus: STATUS.SUCCESS,
                passwordChangeResult: payload,
                passwordChangeErrorMessage: ""
            }
        case AMBASSADOR.PASSWORD_CHANGE_FAILURE:
            return {
                ...state,
                passwordChangeStatus: STATUS.ERROR,
                passwordChangeResult: null,
                passwordChangeErrorMessage: payload
            }
        case AMBASSADOR.PASSWORD_CHANGE_RESET:
            return {
                ...state,
                passwordChangeStatus: STATUS.DEFAULT,
                passwordChangeResult: null,
                passwordChangeErrorMessage: ""
            }
        default:
            return state;
    }
}