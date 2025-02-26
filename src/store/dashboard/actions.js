import { STATE } from "../../constant";

// ------ counts actions -------
export function countsRequest(token, data) {
    return {
        type: STATE.COUNTS_REQUEST,
        payload: {
            token,
            data
        }
    }
}

export function countsReset() {
    return {
        type: STATE.COUNTS_RESET
    }
}

// ------ sales summary actions ----
export function salesSummaryRequest(token, data) {
    return {
        type: STATE.SALES_SUMMARY_REQUEST,
        payload: {
            token,
            data
        }
    }
}

export function salesSummaryReset() {
    return {
        type: STATE.SALES_SUMMARY_RESET
    }
}

// ------- sales trend actions ----
export function salesTrendRequest(token, data) {
    return {
        type: STATE.SALES_TREND_REQUEST,
        payload: {
            token,
            data
        }
    }
}

export function salesTrendReset() {
    return {
        type: STATE.SALES_TREND_RESET
    }
}

// ------- last session actions ----
export function lastSessionRequest(token, data) {
    return {
        type: STATE.LAST_SESSION_REQUEST,
        payload: {
            token,
            data
        }
    }
}

export function lastSessionReset() {
    return {
        type: STATE.LAST_SESSION_RESET
    }
}

// ------- parent's students actions ----
export function parentStudentsRequest(token, data) {
    return {
        type: STATE.PARENT_STUDENTS_REQUEST,
        payload: {
            token,
            data
        }
    }
}

export function parentStudentsReset() {
    return {
        type: STATE.PARENT_STUDENTS_RESET
    }
}


// ------- staff view actions ----
export function staffViewRequest(token, data) {
    return {
        type: STATE.STAFF_VIEW_REQUEST,
        payload: {
            token,
            data
        }
    }
}

export function staffViewReset() {
    return {
        type: STATE.STAFF_VIEW_RESET
    }
}