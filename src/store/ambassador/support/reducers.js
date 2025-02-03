import { AMBASSADOR, STATUS } from "../../../constant";

const INITIAL_STATE = {
    supportHelpListResult: [],
    supportHelpListErrorMessage: "",
    supportHelpStatus: STATUS.DEFAULT
}

export default (state = INITIAL_STATE, { type, payload }) => {
    switch (type) {
        case AMBASSADOR.SUPPORT_HELP_LOADING:
            return {
                ...state,
                supportHelpStatus: STATUS.LOADING
            }
        case AMBASSADOR.SUPPORT_HELP_SUCCESS:
            return {
                ...state,
                supportHelpListResult: payload,
                supportHelpListErrorMessage: "",
                supportHelpStatus: STATUS.SUCCESS
            }
        case AMBASSADOR.SUPPORT_HELP_FAILURE:
            return {
                ...state,
                supportHelpListResult: [],
                supportHelpListErrorMessage: payload,
                supportHelpStatus: STATUS.ERROR
            }
        case AMBASSADOR.SUPPORT_HELP_RESET: 
            return {
                ...state,
                supportHelpListResult: [],
                supportHelpListErrorMessage: "",
                supportHelpStatus: STATUS.DEFAULT
            }    
        default:
            return state;
    }
}