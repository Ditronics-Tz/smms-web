import { AMBASSADOR  } from "../../../constant";

export function passwordChangeRequest(token, old_pass, new_pass, confirm_pass ) {
    return {
        type: AMBASSADOR.PASSWORD_CHANGE_REQUEST,
        payload: {
            token,
            old_pass,
            new_pass,
            confirm_pass,
        }
    }
}

export function passwordChangeReset() {
    return {
        type: AMBASSADOR.PASSWORD_CHANGE_RESET
    }
}