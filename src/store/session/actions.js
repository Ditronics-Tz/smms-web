import { STATE } from "../../constant";

// ---- Card Request
export function scanCardRequest(token, data){
    return {
        type: STATE.SCAN_CARD_REQUEST,
        payload:{
            token,
            data
        }
    }
}

export function scanCardReset(){
    return {
        type: STATE.SCAN_CARD_RESET
    }
}

// ----- Start Session
export function startSessionRequest(token, data){
    return {
        type: STATE.START_SESSION_REQUEST,
        payload: {
            token,
            data
        }
    }
}

export function startSessionReset(){
    return {
        type: STATE.START_SESSION_RESET,
    }
}

// ----- End Session
export function endSessionRequest(token, data){
    return {
        type: STATE.END_SESSION_REQUEST,
        payload:{
            token,
            data
        }
    }
}

export function endSessionReset(){
    return {
        type: STATE.END_SESSION_RESET
    }
}

// ----- Scanned list
export function scannedListRequest(token, data, page){
    return {
        type: STATE.SCANNED_LIST_REQUEST,
        payload: {
            token,
            data,
            page
        }
    }
}

export function scannedListReset(){
    return {
        type: STATE.SCANNED_LIST_RESET
    }
}

// ----- Session List
export function sessionListRequest(token, data, page){
    return {
        type: STATE.SESSION_LIST_REQUEST,
        payload: {
            token,
            data,
            page
        }
    }
}

export function sessionListReset(){
    return {
        type: STATE.SESSION_LIST_RESET
    }
}

// ----- Transaction List
export function transactionsRequest(token, data, page){
    return {
        type: STATE.TRANSACTIONS_REQUEST,
        payload: {
            token,
            data,
            page
        }
    }
}

export function transactionsReset(){
    return {
        type: STATE.TRANSACTIONS_RESET
    }
}