import { STATE } from "../../constant";

/* _________________ STUDENT ACTIONS _______________ */
// student list action
export function studentListRequest(token, data, page) {
    return {
        type: STATE.STUDENT_LIST_REQUEST,
        payload: {
            token,
            data,
            page
        }
    }
}

export function studentListReset() {
    return {
        type: STATE.STUDENT_LIST_RESET
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

// student edit actions
export function studentEditRequest(token, data){
    return {
        type: STATE.STUDENT_EDIT_REQUEST,
        payload: {
            token,
            data
        }
    }
}

export function studentEditReset(){
    return {
        type: STATE.STUDENT_EDIT_RESET
    }
}