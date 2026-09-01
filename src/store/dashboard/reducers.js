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

    lastSessionStatus: STATUS.DEFAULT,
    lastSessionResult: null,
    lastSessionErrorMessage: '',

    parentStudentsStatus: STATUS.DEFAULT,
    parentStudentsResult: null,
    parentStudentsErrorMessage: '',

    staffViewStatus: STATUS.DEFAULT,
    staffViewResult: null,
    staffViewErrorMessage: '',

    childSpendStatus: STATUS.DEFAULT,
    childSpendResult: null,
    childSpendErrorMessage: '',
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
                ...state,
                countsStatus: STATUS.SUCCESS,
                countsResult: payload,
                countsErrorMessage: ''
            }

        case STATE.COUNTS_FAILURE:
            return {
                ...state,
                countsStatus: STATUS.ERROR,
                countsResult: null,
                countsErrorMessage: payload
            }

        case STATE.COUNTS_RESET:
            return {
                ...state,
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
                ...state,
                salesSummaryStatus: STATUS.SUCCESS,
                salesSummaryResult: payload,
                salesSummaryErrorMessage: ''
            }

        case STATE.SALES_SUMMARY_FAILURE:
            return {
                ...state,
                salesSummaryStatus: STATUS.ERROR,
                salesSummaryResult: null,
                salesSummaryErrorMessage: payload
            }

        case STATE.SALES_SUMMARY_RESET:
            return {
                ...state,
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
                ...state,
                salesTrendStatus: STATUS.SUCCESS,
                salesTrendResult: payload,
                salesTrendErrorMessage: ''
            }

        case STATE.SALES_TREND_FAILURE:
            return {
                ...state,
                salesTrendStatus: STATUS.ERROR,
                salesTrendResult: null,
                salesTrendErrorMessage: payload
            }

        case STATE.SALES_TREND_RESET:
            return {
                ...state,
                salesTrendStatus: STATUS.DEFAULT,
                salesTrendResult: null,
                salesTrendErrorMessage: ''
            }


        // LAST SESSION
        case STATE.LAST_SESSION_LOADING:
            return {
                ...state,
                lastSessionStatus: STATUS.LOADING
            }

        case STATE.LAST_SESSION_SUCCESS:
            return {
                ...state,
                lastSessionStatus: STATUS.SUCCESS,
                lastSessionResult: payload,
                lastSessionErrorMessage: ''
            }

        case STATE.LAST_SESSION_FAILURE:
            return {
                ...state,
                lastSessionStatus: STATUS.ERROR,
                lastSessionResult: null,
                lastSessionErrorMessage: payload
            }

        case STATE.LAST_SESSION_RESET:
            return {
                ...state,
                lastSessionStatus: STATUS.DEFAULT,
                lastSessionResult: null,
                lastSessionErrorMessage: ''
            }


        // PARENT'S STUDENTS
        case STATE.PARENT_STUDENTS_LOADING:
            return {
                ...state,
                parentStudentsStatus: STATUS.LOADING
            }

        case STATE.PARENT_STUDENTS_SUCCESS:
            return {
                ...state,
                parentStudentsStatus: STATUS.SUCCESS,
                parentStudentsResult: payload,
                parentStudentsErrorMessage: ''
            }

        case STATE.PARENT_STUDENTS_FAILURE:
            return {
                ...state,
                parentStudentsStatus: STATUS.ERROR,
                parentStudentsResult: null,
                parentStudentsErrorMessage: payload
            }

        case STATE.PARENT_STUDENTS_RESET:
            return {
                ...state,
                parentStudentsStatus: STATUS.DEFAULT,
                parentStudentsResult: null,
                parentStudentsErrorMessage: ''
            }


        // STAFF VIEW
        case STATE.STAFF_VIEW_LOADING:
            return {
                ...state,
                staffViewStatus: STATUS.LOADING
            }

        case STATE.STAFF_VIEW_SUCCESS:
            return {
                ...state,
                staffViewStatus: STATUS.SUCCESS,
                staffViewResult: payload,
                staffViewErrorMessage: ''
            }

        case STATE.STAFF_VIEW_FAILURE:
            return {
                ...state,
                staffViewStatus: STATUS.ERROR,
                staffViewResult: null,
                staffViewErrorMessage: payload
            }

        case STATE.STAFF_VIEW_RESET:
            return {
                ...state,
                staffViewStatus: STATUS.DEFAULT,
                staffViewResult: null,
                staffViewErrorMessage: ''
            }

        // CHILD SPEND
        case STATE.CHILD_SPEND_LOADING:
            return {
                ...state,
                childSpendStatus: STATUS.LOADING
            }

        case STATE.CHILD_SPEND_SUCCESS:
            return {
                ...state,
                childSpendStatus: STATUS.SUCCESS,
                childSpendResult: payload,
                childSpendErrorMessage: ''
            }

        case STATE.CHILD_SPEND_FAILURE:
            return {
                ...state,
                childSpendStatus: STATUS.ERROR,
                childSpendResult: null,
                childSpendErrorMessage: payload
            }

        case STATE.CHILD_SPEND_RESET:
            return {
                ...state,
                childSpendStatus: STATUS.DEFAULT,
                childSpendResult: null,
                childSpendErrorMessage: ''
            }

        default:
            return state
    }
}