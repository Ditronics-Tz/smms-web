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