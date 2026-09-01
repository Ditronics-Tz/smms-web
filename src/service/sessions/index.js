import { DEPOSIT_REQUESTS_URL, DEPOSIT_REQUEST_URL, END_SESSION_URL, REVERSE_TRANSACTION_URL, SCAN_CARD_URL, SCANNED_LIST_URL, SESSION_LIST_URL, START_SESSION_URL, TRANSACTIONS_URL } from "../../constant";
import { listRequest, resourceRequest } from "../calls";

// scan card
export function doScanCard(token, data){
    return resourceRequest(token, SCAN_CARD_URL, data)
}
// start session
export function doStartSession(token, data){
    return resourceRequest(token, START_SESSION_URL, data)
}

// end session
export function doEndSession(token, data){
    return resourceRequest(token, END_SESSION_URL, data)
}

// session list
export function doSessionList(token, data){
    return resourceRequest(token, SESSION_LIST_URL, data)
}

// scanned list
export function doScannedList(token, data, page){
    return listRequest(token, SCANNED_LIST_URL, data, page)
}

// Transactions
export function doTransactions(token , data, page){
    return listRequest(token, TRANSACTIONS_URL, data, page)
}

// Reverse a transaction
export function doReverseTransaction(token, data){
    return resourceRequest(token, REVERSE_TRANSACTION_URL, data)
}

// Deposit / top-up request
export function doDepositRequest(token, data){
    return resourceRequest(token, DEPOSIT_REQUEST_URL, data)
}

// Deposit / top-up requests list
export function doDepositList(token, data, page){
    return listRequest(token, DEPOSIT_REQUESTS_URL, data, page)
}