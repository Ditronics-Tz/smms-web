import { STATE, STATUS } from "../../constant";

const INITIATE_STATE = {
    scanCardStatus: STATUS.DEFAULT,
    scanCardResult: null,
    scanCardErrorMessage: '',

    startSessionStatus: STATUS.DEFAULT,
    startSessionResult: null,
    startSessionErrorMessage: '',

    endSessionStatus: STATUS.DEFAULT,
    endSessionResult: null,
    endSessionErrorMessage: '',

    sessionListStatus: STATUS.DEFAULT,
    sessionListResult: null,
    sessionListErrorMessage: '',

    scannedListStatus: STATUS.DEFAULT,
    scannedListResult: null,
    scannedListErrorMessage: '',

    transactionsStatus: STATUS.DEFAULT,
    transactionsResult: null,
    transactionsErrorMessage: '',

    reverseStatus: STATUS.DEFAULT,
    reverseResult: null,
    reverseErrorMessage: '',

    depositStatus: STATUS.DEFAULT,
    depositResult: null,
    depositErrorMessage: '',

    depositRequestsStatus: STATUS.DEFAULT,
    depositRequestsResult: null,
    depositRequestsErrorMessage: '',
}

/* eslint-disable */
export default (state = INITIATE_STATE, { type, payload }) => {
    switch (type) {
        // SCAN CARD
        case STATE.SCAN_CARD_LOADING:
            return {
                ...state,
                scanCardStatus: STATUS.LOADING
            }

        case STATE.SCAN_CARD_SUCCESS:
            return {
                ...state,
                scanCardStatus: STATUS.SUCCESS,
                scanCardResult: payload,
                scanCardErrorMessage: ''
            }

        case STATE.SCAN_CARD_FAILURE:
            return {
                ...state,
                scanCardStatus: STATUS.ERROR,
                scanCardResult: null,
                scanCardErrorMessage: payload
            }

        case STATE.SCAN_CARD_RESET:
            return {
                ...state,
                scanCardStatus: STATUS.DEFAULT,
                scanCardResult: null,
                scanCardErrorMessage: ''
            }

        // START SESSION
        case STATE.START_SESSION_LOADING:
            return {
                ...state,
                startSessionStatus: STATUS.LOADING
            }

        case STATE.START_SESSION_SUCCESS:
            return {
                ...state,
                startSessionStatus: STATUS.SUCCESS,
                startSessionResult: payload,
                startSessionErrorMessage: ''
            }

        case STATE.START_SESSION_FAILURE:
            return {
                ...state,
                startSessionStatus: STATUS.ERROR,
                startSessionResult: null,
                startSessionErrorMessage: payload
            }

        case STATE.START_SESSION_RESET:
            return {
                ...state,
                startSessionStatus: STATUS.DEFAULT,
                startSessionResult: null,
                startSessionErrorMessage: ''
            }

        // END SESSION
        case STATE.END_SESSION_LOADING:
            return {
                ...state,
                endSessionStatus: STATUS.LOADING
            }

        case STATE.END_SESSION_SUCCESS:
            return {
                ...state,
                endSessionStatus: STATUS.SUCCESS,
                endSessionResult: payload,
                endSessionErrorMessage: ''
            }

        case STATE.END_SESSION_FAILURE:
            return {
                ...state,
                endSessionStatus: STATUS.ERROR,
                endSessionResult: null,
                endSessionErrorMessage: payload
            }

        case STATE.END_SESSION_RESET:
            return {
                ...state,
                endSessionStatus: STATUS.DEFAULT,
                endSessionResult: null,
                endSessionErrorMessage: ''
            }

        // SESSION LIST
        case STATE.SESSION_LIST_LOADING:
            return {
                ...state,
                sessionListStatus: STATUS.LOADING
            }

        case STATE.SESSION_LIST_SUCCESS:
            return {
                ...state,
                sessionListStatus: STATUS.SUCCESS,
                sessionListResult: payload,
                sessionListErrorMessage: ''
            }

        case STATE.SESSION_LIST_FAILURE:
            return {
                ...state,
                sessionListStatus: STATUS.ERROR,
                sessionListResult: null,
                sessionListErrorMessage: payload
            }

        case STATE.SESSION_LIST_RESET:
            return {
                ...state,
                sessionListStatus: STATUS.DEFAULT,
                sessionListResult: null,
                sessionListErrorMessage: ''
            }

        // SCANNED LIST
        case STATE.SCANNED_LIST_LOADING:
            return {
                ...state,
                scannedListStatus: STATUS.LOADING
            }

        case STATE.SCANNED_LIST_SUCCESS:
            return {
                ...state,
                scannedListStatus: STATUS.SUCCESS,
                scannedListResult: payload,
                scannedListErrorMessage: ''
            }

        case STATE.SCANNED_LIST_FAILURE:
            return {
                ...state,
                scannedListStatus: STATUS.ERROR,
                scannedListResult: null,
                scannedListErrorMessage: payload
            }

        case STATE.SCANNED_LIST_RESET:
            return {
                ...state,
                scannedListStatus: STATUS.DEFAULT,
                scannedListResult: null,
                scannedListErrorMessage: ''
            }

         // TRANSACTIONS LIST
         case STATE.TRANSACTIONS_LOADING:
            return {
                ...state,
                transactionsStatus: STATUS.LOADING
            }

        case STATE.TRANSACTIONS_SUCCESS:
            return {
                ...state,
                transactionsStatus: STATUS.SUCCESS,
                transactionsResult: payload,
                transactionsErrorMessage: ''
            }

        case STATE.TRANSACTIONS_FAILURE:
            return {
                ...state,
                transactionsStatus: STATUS.ERROR,
                transactionsResult: null,
                transactionsErrorMessage: payload
            }

        case STATE.TRANSACTIONS_RESET:
            return {
                ...state,
                transactionsStatus: STATUS.DEFAULT,
                transactionsResult: null,
                transactionsErrorMessage: ''
            }

        // REVERSE TRANSACTION
        case STATE.REVERSE_TRANSACTION_LOADING:
            return {
                ...state,
                reverseStatus: STATUS.LOADING
            }

        case STATE.REVERSE_TRANSACTION_SUCCESS:
            return {
                ...state,
                reverseStatus: STATUS.SUCCESS,
                reverseResult: payload,
                reverseErrorMessage: ''
            }

        case STATE.REVERSE_TRANSACTION_FAILURE:
            return {
                ...state,
                reverseStatus: STATUS.ERROR,
                reverseResult: null,
                reverseErrorMessage: payload
            }

        case STATE.REVERSE_TRANSACTION_RESET:
            return {
                ...state,
                reverseStatus: STATUS.DEFAULT,
                reverseResult: null,
                reverseErrorMessage: ''
            }

        // DEPOSIT / TOP-UP REQUEST
        case STATE.DEPOSIT_REQUEST_LOADING:
            return {
                ...state,
                depositStatus: STATUS.LOADING
            }

        case STATE.DEPOSIT_REQUEST_SUCCESS:
            return {
                ...state,
                depositStatus: STATUS.SUCCESS,
                depositResult: payload,
                depositErrorMessage: ''
            }

        case STATE.DEPOSIT_REQUEST_FAILURE:
            return {
                ...state,
                depositStatus: STATUS.ERROR,
                depositResult: null,
                depositErrorMessage: payload
            }

        case STATE.DEPOSIT_REQUEST_RESET:
            return {
                ...state,
                depositStatus: STATUS.DEFAULT,
                depositResult: null,
                depositErrorMessage: ''
            }

        // DEPOSIT / TOP-UP REQUESTS LIST
        case STATE.DEPOSIT_LIST_LOADING:
            return {
                ...state,
                depositRequestsStatus: STATUS.LOADING
            }

        case STATE.DEPOSIT_LIST_SUCCESS:
            return {
                ...state,
                depositRequestsStatus: STATUS.SUCCESS,
                depositRequestsResult: payload,
                depositRequestsErrorMessage: ''
            }

        case STATE.DEPOSIT_LIST_FAILURE:
            return {
                ...state,
                depositRequestsStatus: STATUS.ERROR,
                depositRequestsResult: null,
                depositRequestsErrorMessage: payload
            }

        case STATE.DEPOSIT_LIST_RESET:
            return {
                ...state,
                depositRequestsStatus: STATUS.DEFAULT,
                depositRequestsResult: null,
                depositRequestsErrorMessage: ''
            }

        default:
            return state
    }
}