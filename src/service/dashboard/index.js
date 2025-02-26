import { COUNTS_URL, LAST_SESSION_URL,  PARENT_STUDENTS_URL, SALES_SUMMARY_URL, SALES_TREND_URL, STAFF_DETAILS_URL, STAFF_VIEW_URL } from "../../constant";
import {  resourceRequest } from "../calls";

// counts
export function doCounts(token, data){
    return resourceRequest(token, COUNTS_URL, data)
}

// sales summary
export function doSalesSummary(token, data){
    return resourceRequest(token, SALES_SUMMARY_URL, data)
}

// sales trend
export function doSalesTrend(token, data){
    return resourceRequest(token, SALES_TREND_URL, data)
}

// last session
export function doLastSession(token, data){
    return resourceRequest(token, LAST_SESSION_URL, data)
}

// parent's students
export function doParentStudents(token, data){
    return resourceRequest(token, PARENT_STUDENTS_URL, data)
}

// staff view
export function doStaffView(token, data){
    return resourceRequest(token, STAFF_VIEW_URL, data)
}