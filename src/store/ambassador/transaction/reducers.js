import { AMBASSADOR, STATUS } from "../../../constant";


const INITIAL_STATE = {

    transactionHistoryResult: null,
    transactionHistoryStatus: STATUS.DEFAULT,
    transactionHistoryErrorMessage: '',

    transferFundResult: null,
    transferFundStatus: STATUS.DEFAULT,
    transferFundErrorMessage: '',

    withdrawResult: null,
    withdrawStatus: STATUS.DEFAULT,
    withdrawErrorMessage: '',

    verifyWithdrawResult: null,
    verifyWithdrawStatus: STATUS.DEFAULT,
    verifyWithErrorMessage: '',
};

export default (state = INITIAL_STATE, { type, payload }) => {
    switch (type) {
        case AMBASSADOR.TRANSACTION_HISTORY_LOADING:
            return {
                ...state,
                transactionHistoryStatus: STATUS.LOADING,
            }
        case AMBASSADOR.TRANSACTION_HISTORY_SUCCESS:
            return {
                ...state,
                transactionHistoryResult: payload,
                transactionHistoryStatus: STATUS.SUCCESS,
                transactionHistoryErrorMessage: ''
            }
        case AMBASSADOR.TRANSACTION_HISTORY_FAILURE:
            return {
                ...state,
                transactionHistoryResult: null,
                transactionHistoryStatus: STATUS.ERROR,
                transactionHistoryErrorMessage: payload
            }
        case AMBASSADOR.TRANSACTION_HISTORY_RESET:
            return {
                ...state,
                transactionHistoryResult: null,
                transactionHistoryStatus: STATUS.DEFAULT,
                transactionHistoryErrorMessage: ''
            }

        // transfer fund
        case AMBASSADOR.TRANSFER_FUND_LOADING:
            return {
                ...state,
                transferFundStatus: STATUS.LOADING,
            }
        case AMBASSADOR.TRANSFER_FUND_SUCCESS:
            return {
                ...state,
                transferFundResult: payload,
                transferFundStatus: STATUS.SUCCESS,
                transferFundErrorMessage: '',
            }
        case AMBASSADOR.TRANSFER_FUND_FAILURE:
            return {
                ...state,
                transferFundResult: null,
                transferFundStatus: STATUS.ERROR,
                transferFundErrorMessage: payload,
            }
        case AMBASSADOR.TRANSFER_FUND_RESET:
            return {
                ...state,
                transferFundResult: null,
                transferFundStatus: STATUS.DEFAULT,
                transferFundErrorMessage: '',
            }

        // withdraw fund
        case AMBASSADOR.WITHDRAW_LOADING:
            return {
                ...state,
                withdrawStatus: STATUS.LOADING,
            }
        case AMBASSADOR.WITHDRAW_SUCCESS:
            return {
                ...state,
                withdrawResult: payload,
                withdrawStatus: STATUS.SUCCESS,
                withdrawErrorMessage: '',
            }
        case AMBASSADOR.WITHDRAW_FAILURE:
            return {
                ...state,
                withdrawResult: null,
                withdrawStatus: STATUS.ERROR,
                withdrawErrorMessage: payload,
            }
        case AMBASSADOR.WITHDRAW_RESET:
            return {
                ...state,
                withdrawResult: null,
                withdrawStatus: STATUS.DEFAULT,
                withdrawErrorMessage: '',
            }

        //  verify withdraw fund
        case AMBASSADOR.VERIFY_WITHDRAW_LOADING:
            return {
                ...state,
                verifyWithdrawStatus: STATUS.LOADING,
            }
        case AMBASSADOR.VERIFY_WITHDRAW_SUCCESS:
            return {
                ...state,
                verifyWithdrawResult: payload,
                verifyWithdrawStatus: STATUS.SUCCESS,
                verifyWithdrawErrorMessage: '',
            }
        case AMBASSADOR.VERIFY_WITHDRAW_FAILURE:
            return {
                ...state,
                verifyWithdrawResult: null,
                verifyWithdrawStatus: STATUS.ERROR,
                verifyWithdrawErrorMessage: payload,
            }
        case AMBASSADOR.VERIFY_WITHDRAW_RESET:
            return {
                ...state,
                verifyWithdrawResult: null,
                verifyWithdrawStatus: STATUS.DEFAULT,
                verifyWithdrawErrorMessage: '',
            }
        default:
            return state;
    }
}