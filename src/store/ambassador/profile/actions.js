import { ACTION_ACCOUNT_REMOVE, ACTION_RESET_APP_STATE, AMBASSADOR  } from "../../../constant";
// import { clearUserData } from "../../utils/storage";


export function fetchAmbassadorProfile(token) {
    return {
        type: AMBASSADOR.PROFILE_DETAILS_REQUEST,
        payload: {
            token
        }
    }
}

export function fetchProfileReset() {
    return {
        type: AMBASSADOR.PROFILE_DETAILS_RESET
    }
}

export function removeUserAccountRequest() {
    // clearUserData();
    return {
        type: ACTION_ACCOUNT_REMOVE
    }
}

export function resetAppStateOnLoading() {
    return {
        type: ACTION_RESET_APP_STATE
    }
}