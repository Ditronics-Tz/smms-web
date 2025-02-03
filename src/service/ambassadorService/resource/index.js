import { AMBASSADOR_LOANS_URL, APPROVE_LOAN_URL, CLIENT_LOAN_HISTORY_URL, LOAN_APPROVE_TOKEN_URL, PAYPLAN_ASSIGN_URL, PAYPLAN_LIST_URL, PENDING_LOAN_URL, REJECT_LOAN_URL, UNDERWRITING_URL, VERIFY_CLIENT_URL } from "../../../constant";
import { resourceRequest } from "../../calls";

export function doFetchPendingLoan(token) {
    const data = {};
    return resourceRequest(token, PENDING_LOAN_URL, data);
}

export function doFetchClientLoanHistory(token, client_id) {
    const data = {
        "client_id": client_id
    }
    return resourceRequest(token, CLIENT_LOAN_HISTORY_URL, data);
}

export function doApproveLoanRequest(token, loan_id, loan_otp) {
    const data = {
        "loan_id": loan_id,
        "loan_otp": loan_otp
    }
    return resourceRequest(token, APPROVE_LOAN_URL, data);
}

export function doLoanApproveTokenRequest(token, loan_id) {
    const data = {
        "loan_id": loan_id
    }
    return resourceRequest(token, LOAN_APPROVE_TOKEN_URL, data)
}

export function doRejectLoanRequest(token, loan_id, remark) {
    const data = {
        "loan_id": loan_id,
        "remark" : remark
    }
    return resourceRequest(token, REJECT_LOAN_URL, data);
}

export function doAmbassadorLoanListRequest(token, loan_status) {
    const data = {
        "loan_status": loan_status
    }
    return resourceRequest(token, AMBASSADOR_LOANS_URL, data);
}

export function doPlayPlanListRequest(token) {
    const data = {};
    return resourceRequest(token, PAYPLAN_LIST_URL, data);
}

export function doVerifyClientRequest(token, mobile) {
    const data = {
        'mobile': mobile
    };
    return resourceRequest(token, VERIFY_CLIENT_URL, data);
}

export function doPayPlanAssign(token, payplan, clients) {
    const data = {
        'pay_plan': payplan,
        'clients': clients
    };
    return resourceRequest(token, PAYPLAN_ASSIGN_URL, data);
}

export function doFetchUnderwritings(token, loan_id){
    const data = {
        "loan_id": loan_id
    }
    return resourceRequest(token, UNDERWRITING_URL, data)
}