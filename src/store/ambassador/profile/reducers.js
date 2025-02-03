import { ACTION_ACCOUNT_REMOVE, ACTION_ACCOUNT_SETUP, AMBASSADOR , STATUS } from "../../../constant";

const INITIAL_STATE = {
    // account information
    accountState: STATUS.ACCOUNT.NOT_SET, 

    profileResult: null,
    profileStatus: STATUS.DEFAULT,
    profileErrorMessage: ''
}

export default (state = INITIAL_STATE, { type, payload }) => {
    switch (type) {
        case ACTION_ACCOUNT_SETUP:
            return {
                ...state,
                accountState: STATUS.ACCOUNT.SETUP
            }
        case ACTION_ACCOUNT_REMOVE: {
            return {
                ...state,
                accountState: STATUS.ACCOUNT.NOT_SET
            }
        }
        
        case AMBASSADOR.PROFILE_DETAILS_LOADING:
            return {
                ...state,
                profileStatus: STATUS.LOADING
            }
        case AMBASSADOR.PROFILE_DETAILS_SUCCESS:
            return {
                ...state,
                profileResult: payload,
                profileStatus: STATUS.SUCCESS,
                profileErrorMessage: ''
            }
        case AMBASSADOR.PROFILE_DETAILS_FAILURE: 
            return {
                ...state,
                profileResult: null,
                profileStatus: STATUS.ERROR,
                profileErrorMessage: payload
            }
        case AMBASSADOR.PROFILE_DETAILS_RESET:
            return {
                ...state,
                profileStatus: STATUS.DEFAULT,
                profileErrorMessage: ''
            }    
        default:
            return state;
    }
}