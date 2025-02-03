import { AMBASSADOR, STATUS } from "../../../constant";

const INITIAL_STATE = {
    //FETCHING PENDING LOANS
    pendingLoanListResult: null,
    pendingLoanListStatus: STATUS.DEFAULT,
    pendingLoanListErrorMessage: '',

    clientLoanHistoryResult: null,
    clientLoanHistoryStatus: STATUS.DEFAULT,
    clientLoanHistoryErrorMessage: '',

    approveLoanResult: null,
    approveLoanStatus: STATUS.DEFAULT,
    approveLoanErrorMessage: '',

    rejectLoanResult: null,
    rejectLoanStatus: STATUS.DEFAULT,
    rejectLoanErrorMessage: '',

    ambassadorLoanResult: null,
    ambassadorLoanStatus: STATUS.DEFAULT,
    ambassadorLoanErrorMessage: '',

    loanApproveTokenResult: null,
    loanApproveTokenStatus: STATUS.DEFAULT,
    loanApproveTokenErrorMessage: '',

    payPlanListResult: null,
    payPlanListStatus: STATUS.DEFAULT,
    payPlanListErrorMessage: '',

    verifyClientResult: null,
    verifyClientStatus: STATUS.DEFAULT,
    verifyClientErrorMessage: '',

    payPlanAssignResult: null,
    payPlanAssignStatus: STATUS.DEFAULT,
    payPlanAssignErrorMessage: '',

    underwritingStatus: STATUS.DEFAULT,
    underwritingResult: null,
    underwritingErrorMessage: ''
}

export default (state = INITIAL_STATE, { type, payload }) => {
    switch (type) {
        case AMBASSADOR.PENDING_LOAN_LIST_LOADING:
            return {
                ...state,
                pendingLoanListStatus: STATUS.LOADING,
            }
        case AMBASSADOR.PENDING_LOAN_LIST_SUCCESS:
            return {
                ...state,
                pendingLoanListResult: payload,
                pendingLoanListStatus: STATUS.SUCCESS,
                pendingLoanListErrorMessage: ''
            }
        case AMBASSADOR.PENDING_LOAN_LIST_FAILURE:
            return {
                ...state,
                pendingLoanListResult: null,
                pendingLoanListStatus: STATUS.ERROR,
                pendingLoanListErrorMessage: payload
            }
        case AMBASSADOR.PENDING_LOAN_LIST_RESET:
            return {
                ...state,
                pendingLoanListResult: null,
                pendingLoanListStatus: STATUS.DEFAULT,
                pendingLoanListErrorMessage: ''
            }
        case AMBASSADOR.CLIENT_LOAN_HISTORY_LOADING:
            return {
                ...state,
                clientLoanHistoryStatus: STATUS.LOADING,
            }
        case AMBASSADOR.CLIENT_LOAN_HISTORY_SUCCESS:
            return {
                ...state,
                clientLoanHistoryResult: payload,
                clientLoanHistoryStatus: STATUS.SUCCESS,
                clientLoanHistoryErrorMessage: ''
            }
        case AMBASSADOR.CLIENT_LOAN_HISTORY_FAILURE:
            return {
                ...state,
                clientLoanHistoryResult: null,
                clientLoanHistoryStatus: STATUS.ERROR,
                clientLoanHistoryErrorMessage: payload
            }
        case AMBASSADOR.CLIENT_LOAN_HISTORY_RESET:
            return {
                ...state,
                clientLoanHistoryResult: null,
                clientLoanHistoryStatus: STATUS.DEFAULT,
                clientLoanHistoryErrorMessage: ''
            }
        case AMBASSADOR.APPROVE_LOAN_LOADING:
            return {
                ...state,
                approveLoanStatus: STATUS.LOADING,
            }
        case AMBASSADOR.APPROVE_LOAN_SUCCESS:
            return {
                ...state,
                approveLoanResult: payload,
                approveLoanStatus: STATUS.SUCCESS,
                approveLoanErrorMessage: ''
            }
        case AMBASSADOR.APPROVE_LOAN_FAILURE:
            return {
                ...state,
                approveLoanResult: null,
                approveLoanStatus: STATUS.ERROR,
                approveLoanErrorMessage: payload
            }
        case AMBASSADOR.APPROVE_LOAN_RESET:
            return {
                ...state,
                approveLoanResult: null,
                approveLoanStatus: STATUS.DEFAULT,
                approveLoanErrorMessage: ''
            }
        case AMBASSADOR.REJECT_LOAN_LOADING:
            return {
                ...state,
                rejectLoanStatus: STATUS.LOADING,
            }
        case AMBASSADOR.REJECT_LOAN_SUCCESS:
            return {
                ...state,
                rejectLoanResult: payload,
                rejectLoanStatus: STATUS.SUCCESS,
                rejectLoanErrorMessage: ''
            }
        case AMBASSADOR.REJECT_LOAN_FAILURE:
            return {
                ...state,
                rejectLoanResult: null,
                rejectLoanStatus: STATUS.ERROR,
                rejectLoanErrorMessage: payload
            }
        case AMBASSADOR.REJECT_LOAN_RESET:
            return {
                ...state,
                rejectLoanResult: null,
                rejectLoanStatus: STATUS.DEFAULT,
                rejectLoanErrorMessage: ''
            }
        case AMBASSADOR.AMBASSADOR_LOAN_LOADING:
            return {
                ...state,
                ambassadorLoanResult: null,
                ambassadorLoanStatus: STATUS.LOADING,
                ambassadorLoanErrorMessage: ''
            }
        case AMBASSADOR.AMBASSADOR_LOAN_SUCCESS:
            return {
                ...state,
                ambassadorLoanResult: payload,
                ambassadorLoanStatus: STATUS.SUCCESS,
                ambassadorLoanErrorMessage: ''
            }
        case AMBASSADOR.AMBASSADOR_LOAN_FAILURE:
            return {
                ...state,
                ambassadorLoanResult: null,
                ambassadorLoanStatus: STATUS.ERROR,
                ambassadorLoanErrorMessage: payload
            }
        case AMBASSADOR.AMBASSADOR_LOAN_RESET:
            return {
                ...state,
                ambassadorLoanResult: null,
                ambassadorLoanStatus: STATUS.DEFAULT,
                ambassadorLoanErrorMessage: ''
            }
        case AMBASSADOR.LOAN_APPROVE_TOKEN_LOADING:
            return {
                ...state,
                loanApproveTokenResult: null,
                loanApproveTokenStatus: STATUS.LOADING,
            }
        case AMBASSADOR.LOAN_APPROVE_TOKEN_FAILURE:
            return {
                ...state,
                loanApproveTokenResult: null,
                loanApproveTokenStatus: STATUS.ERROR,
                loanApproveTokenErrorMessage: payload
            }
        case AMBASSADOR.LOAN_APPROVE_TOKEN_SUCCESS:
            return {
                ...state,
                loanApproveTokenResult: payload,
                loanApproveTokenStatus: STATUS.SUCCESS,
                loanApproveTokenErrorMessage: ''
            }
        case AMBASSADOR.LOAN_APPROVE_TOKEN_RESET:
            return {
                ...state,
                loanApproveTokenResult: null,
                loanApproveTokenStatus: STATUS.DEFAULT,
                loanApproveTokenErrorMessage: ''
            }

        // PAYPLAN REDUCE
        case AMBASSADOR.PAYPLAN_LIST_LOADING:
            return {
                ...state,
                payPlanListResult: null,
                payPlanListStatus: STATUS.LOADING,
            }
        case AMBASSADOR.PAYPLAN_LIST_FAILURE:
            return {
                ...state,
                payPlanListResult: null,
                payPlanListStatus: STATUS.ERROR,
                payPlanListErrorMessage: payload
            }
        case AMBASSADOR.PAYPLAN_LIST_SUCCESS:
            return {
                ...state,
                payPlanListResult: payload,
                payPlanListStatus: STATUS.SUCCESS,
                payPlanListErrorMessage: ''
            }
        case AMBASSADOR.PAYPLAN_LIST_RESET:
            return {
                ...state,
                payPlanListResult: null,
                payPlanListStatus: STATUS.DEFAULT,
                payPlanListErrorMessage: ''
            }

        // VERIFY CLIENT REDUCE
        case AMBASSADOR.VERIFY_CLIENT_LOADING:
            return {
                ...state,
                verifyClientResult: null,
                verifyClientStatus: STATUS.LOADING,
            }
        case AMBASSADOR.VERIFY_CLIENT_FAILURE:
            return {
                ...state,
                verifyClientResult: null,
                verifyClientStatus: STATUS.ERROR,
                verifyClientErrorMessage: payload
            }
        case AMBASSADOR.VERIFY_CLIENT_SUCCESS:
            return {
                ...state,
                verifyClientResult: payload,
                verifyClientStatus: STATUS.SUCCESS,
                verifyClientErrorMessage: ''
            }
        case AMBASSADOR.VERIFY_CLIENT_RESET:
            return {
                ...state,
                verifyClientResult: null,
                verifyClientStatus: STATUS.DEFAULT,
                verifyClientErrorMessage: ''
            }

        // PAYPLAN ASSIGN REDUCE
        case AMBASSADOR.PAYPLAN_ASSIGN_LOADING:
            return {
                ...state,
                payPlanAssignResult: null,
                payPlanAssignStatus: STATUS.LOADING,
            }
        case AMBASSADOR.PAYPLAN_ASSIGN_FAILURE:
            return {
                ...state,
                payPlanAssignResult: null,
                payPlanAssignStatus: STATUS.ERROR,
                payPlanAssignErrorMessage: payload
            }
        case AMBASSADOR.PAYPLAN_ASSIGN_SUCCESS:
            return {
                ...state,
                payPlanAssignResult: payload,
                payPlanAssignStatus: STATUS.SUCCESS,
                payPlanAssignErrorMessage: ''
            }
        case AMBASSADOR.PAYPLAN_ASSIGN_RESET:
            return {
                ...state,
                payPlanAssignResult: null,
                payPlanAssignStatus: STATUS.DEFAULT,
                payPlanAssignErrorMessage: ''
            }

        // UNDERWRITINGS
        case AMBASSADOR.UNDERWRITING_LOADING:
            return {
                ...state,
                underwritingResult: null,
                underwritingStatus: STATUS.LOADING,
            }
        case AMBASSADOR.UNDERWRITING_FAILURE:
            return {
                ...state,
                underwritingResult: null,
                underwritingStatus: STATUS.ERROR,
                underwritingErrorMessage: payload
            }
        case AMBASSADOR.UNDERWRITING_SUCCESS:
            return {
                ...state,
                underwritingResult: payload,
                underwritingStatus: STATUS.SUCCESS,
                underwritingErrorMessage: ''
            }
        case AMBASSADOR.UNDERWRITING_RESET:
            return {
                ...state,
                underwritingResult: null,
                underwritingStatus: STATUS.DEFAULT,
                underwritingErrorMessage: ''
            }
        default:
            return state;
    }
}