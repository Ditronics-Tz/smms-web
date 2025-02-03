import { AMBASSADOR  } from "../../../constant";

export function pendingLoanRequest(token) {
    return {
        type: AMBASSADOR.PENDING_LOAN_LIST_REQUEST,
        payload: {
            token
        }
    }
}

export function pendingLoanReset() {
    return {
        type: AMBASSADOR.PENDING_LOAN_LIST_RESET
    }
}

export function clientLoanHistoryRequest(token, client_id) {
    return {
        type: AMBASSADOR.CLIENT_LOAN_HISTORY_REQUEST,
        payload: {
            token,
            client_id
        }
    }
}

export function clientLoanHistoryReset() {
    return {
        type: AMBASSADOR.CLIENT_LOAN_HISTORY_RESET
    }
}

export function approveLoanRequestAction(token, loan_id, loan_otp) {
    return {
        type: AMBASSADOR.APPROVE_LOAN_REQUEST,
        payload: {
            token,
            loan_id,
            loan_otp
        }
    }
}

export function approveLoanReset() {
    return {
        type: AMBASSADOR.APPROVE_LOAN_RESET
    }
}

export function rejectLoanRequestAction(token, loan_id, remark) {
    return {
        type: AMBASSADOR.REJECT_LOAN_REQUEST,
        payload: {
            token,
            loan_id,
            remark
        }
    }
}

export function rejectLoanReset() {
    return {
        type: AMBASSADOR.REJECT_LOAN_RESET
    }
}

export function ambassadorLoanListRequest(token, loan_status) {
    return {
        type: AMBASSADOR.AMBASSADOR_LOAN_REQUEST,
        payload: {
            token,
            loan_status
        }
    }
}

export function ambassadorLoanListReset() {
    return {
        type: AMBASSADOR.AMBASSADOR_LOAN_RESET
    }
}

export function loanApproveTokenRequest(token, loan_id) {
    return {
        type: AMBASSADOR.LOAN_APPROVE_TOKEN_REQUEST,
        payload: {
            token,
            loan_id
        }
    }
}

export function loanApproveTokenReset() {
    return {
        type: AMBASSADOR.LOAN_APPROVE_TOKEN_RESET
    }
}

/* ------- PAYPLAN ACTIONS------------- */
export function payPlanListrequest(token) {
    return {
        type: AMBASSADOR.PAYPLAN_LIST_REQUEST,
        payload: {
            token
        }
    }
}

export function payPlanListReset() {
    return {
        type: AMBASSADOR.PAYPLAN_LIST_RESET,
    }
}

/* ------- VERIFY CLIENT ACTIONS------------- */
export function verifyClientrequest(token, mobile) {
    return {
        type: AMBASSADOR.VERIFY_CLIENT_REQUEST,
        payload: {
            token,
            mobile
        }
    }
}

export function verifyClientReset() {
    return {
        type: AMBASSADOR.VERIFY_CLIENT_RESET,
    }
}

/* ------- PAYPLAN ASSIGN ACTIONS------------- */
export function payPlanAssignRequest(token, payplan, clients) {
    return {
        type: AMBASSADOR.PAYPLAN_ASSIGN_REQUEST,
        payload: {
            token,
            payplan,
            clients
        }
    }
}

export function payPlanAssignReset() {
    return {
        type: AMBASSADOR.PAYPLAN_ASSIGN_RESET,
    }
}

/* --------- REQUEST UNDERWRITING ------- */
export function underwritingRequest(token, loan_id) {
    return {
        type: AMBASSADOR.UNDERWRITING_REQUEST,
        payload: {
            token,
            loan_id
        }
    }
}

export function underwritingReset(){
    return {
        type: AMBASSADOR.UNDERWRITING_RESET
    }
}