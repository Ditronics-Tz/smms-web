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
    transactionErrorMessage: ''
}

export default (state = INITIATE_STATE, { type: payload }) => {
    switch (state) {
        // SCAN CARD
        case STATE.SCAN_CARD_LOADING:
            return {
                ...state,
                scanCardStatus: STATUS.LOADING
            }

        case STATE.SCAN_CARD_SUCCESS:
            return {
                scanCardStatus: STATUS.SUCCESS,
                scanCardResult: payload,
                scanCardErrorMessage: ''
            }

        case STATE.SCAN_CARD_FAILURE:
            return {
                scanCardStatus: STATUS.ERROR,
                scanCardResult: null,
                scanCardErrorMessage: payload
            }

        case STATE.SCAN_CARD_RESET:
            return {
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
                startSessionStatus: STATUS.SUCCESS,
                startSessionResult: payload,
                startSessionErrorMessage: ''
            }

        case STATE.START_SESSION_FAILURE:
            return {
                startSessionStatus: STATUS.ERROR,
                startSessionResult: null,
                startSessionErrorMessage: payload
            }

        case STATE.START_SESSION_RESET:
            return {
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
                endSessionStatus: STATUS.SUCCESS,
                endSessionResult: payload,
                endSessionErrorMessage: ''
            }

        case STATE.END_SESSION_FAILURE:
            return {
                endSessionStatus: STATUS.ERROR,
                endSessionResult: null,
                endSessionErrorMessage: payload
            }

        case STATE.END_SESSION_RESET:
            return {
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
                sessionListStatus: STATUS.SUCCESS,
                sessionListResult: payload,
                sessionListErrorMessage: ''
            }

        case STATE.SESSION_LIST_FAILURE:
            return {
                sessionListStatus: STATUS.ERROR,
                sessionListResult: null,
                sessionListErrorMessage: payload
            }

        case STATE.SESSION_LIST_RESET:
            return {
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
                scannedListStatus: STATUS.SUCCESS,
                scannedListResult: payload,
                scannedListErrorMessage: ''
            }

        case STATE.SCANNED_LIST_FAILURE:
            return {
                scannedListStatus: STATUS.ERROR,
                scannedListResult: null,
                scannedListErrorMessage: payload
            }

        case STATE.SCANNED_LIST_RESET:
            return {
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
                transactionsStatus: STATUS.SUCCESS,
                transactionsResult: payload,
                transactionsErrorMessage: ''
            }

        case STATE.TRANSACTIONS_FAILURE:
            return {
                transactionsStatus: STATUS.ERROR,
                transactionsResult: null,
                transactionsErrorMessage: payload
            }

        case STATE.TRANSACTIONS_RESET:
            return {
                transactionsStatus: STATUS.DEFAULT,
                transactionsResult: null,
                transactionsErrorMessage: ''
            }

        default:
            return state
    }
}