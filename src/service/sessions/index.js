import { END_SESSION_URL, SCAN_CARD_URL, SCANNED_LIST_URL, SESSION_LIST_URL, START_SESSION_URL } from "../../constant";
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
export function doSessionList(token, data, page){
    return listRequest(token, SESSION_LIST_URL, data, page)
}

// scanned list
export function doScannedList(token, data, page){
    return listRequest(token, SCANNED_LIST_URL, data, page)
}