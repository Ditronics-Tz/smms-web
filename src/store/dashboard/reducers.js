import { STATE, STATUS } from "../../constant";

const INITIATE_STATE = {
    countsStatus: STATUS.DEFAULT,
    countsResult: null,
    countsErrorMessage: '',

    salesSummaryStatus: STATUS.DEFAULT,
    salesSummaryResult: null,
    salesSummaryErrorMessage: '',

    salesTrendStatus: STATUS.DEFAULT,
    salesTrendResult: null,
    salesTrendErrorMessage: '',
}

/* eslint-disable */
export default (state = INITIATE_STATE, { type, payload }) => {
    switch (type) {
        // COUNTS
        case STATE.COUNTS_LOADING:
            return {
                ...state,
                countsStatus: STATUS.LOADING
            }

        case STATE.COUNTS_SUCCESS:
            return {
                countsStatus: STATUS.SUCCESS,
                countsResult: payload,
                countsErrorMessage: ''
            }

        case STATE.COUNTS_FAILURE:
            return {
                countsStatus: STATUS.ERROR,
                countsResult: null,
                countsErrorMessage: payload
            }

        case STATE.COUNTS_RESET:
            return {
                countsStatus: STATUS.DEFAULT,
                countsResult: null,
                countsErrorMessage: ''
            }

        // SALES SUMMARY
        case STATE.SALES_SUMMARY_LOADING:
            return {
                ...state,
                salesSummaryStatus: STATUS.LOADING
            }

        case STATE.SALES_SUMMARY_SUCCESS:
            return {
                salesSummaryStatus: STATUS.SUCCESS,
                salesSummaryResult: payload,
                salesSummaryErrorMessage: ''
            }

        case STATE.SALES_SUMMARY_FAILURE:
            return {
                salesSummaryStatus: STATUS.ERROR,
                salesSummaryResult: null,
                salesSummaryErrorMessage: payload
            }

        case STATE.SALES_SUMMARY_RESET:
            return {
                salesSummaryStatus: STATUS.DEFAULT,
                salesSummaryResult: null,
                salesSummaryErrorMessage: ''
            }

        // SALES TREND
        case STATE.SALES_TREND_LOADING:
            return {
                ...state,
                salesTrendStatus: STATUS.LOADING
            }

        case STATE.SALES_TREND_SUCCESS:
            return {
                salesTrendStatus: STATUS.SUCCESS,
                salesTrendResult: payload,
                salesTrendErrorMessage: ''
            }

        case STATE.SALES_TREND_FAILURE:
            return {
                salesTrendStatus: STATUS.ERROR,
                salesTrendResult: null,
                salesTrendErrorMessage: payload
            }

        case STATE.SALES_TREND_RESET:
            return {
                salesTrendStatus: STATUS.DEFAULT,
                salesTrendResult: null,
                salesTrendErrorMessage: ''
            }

        default:
            return state
    }
}