import { COUNTS_URL, SALES_SUMMARY_URL, SALES_TREND_URL } from "../../constant";
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