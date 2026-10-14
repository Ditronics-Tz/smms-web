import { STATE, STATUS } from "../../constant";

/**
 * FE-16/17/18 (analytics), FE-19 (insights) and FE-20 (export) slice.
 *
 * One status/result/errorMessage triple per endpoint, in the same shape as
 * src/store/ledger/reducers.js:
 *
 *   <section>Status | <section>Result | <section>ErrorMessage
 *
 * The only extra key is `salesQuery`: FE-16 fans one filter set out to several
 * group_by calls (day, item, hour, and one per meal type for the donut) through
 * this single slice, and the saga echoes the request filters back in `meta` so
 * the page can tell which query a response belongs to instead of guessing.
 *
 * This slice is intentionally NOT in the redux-persist whitelist: an analytics
 * snapshot read once is worse than a fresh one, and the persisted payload would
 * grow with every range ever viewed.
 */

const INITIATE_STATE = {
    // FE-16: sales
    salesStatus: STATUS.DEFAULT,
    salesResult: null,
    salesErrorMessage: "",
    salesQuery: null,

    // FE-17: wallet health
    walletHealthStatus: STATUS.DEFAULT,
    walletHealthResult: null,
    walletHealthErrorMessage: "",

    // FE-18: operators
    operatorsStatus: STATUS.DEFAULT,
    operatorsResult: null,
    operatorsErrorMessage: "",

    // FE-18: classes
    classesStatus: STATUS.DEFAULT,
    classesResult: null,
    classesErrorMessage: "",

    // FE-18: penalties
    penaltiesStatus: STATUS.DEFAULT,
    penaltiesResult: null,
    penaltiesErrorMessage: "",

    // FE-20: export
    exportStatus: STATUS.DEFAULT,
    exportResult: null,
    exportErrorMessage: "",

    // FE-19: forecast
    forecastStatus: STATUS.DEFAULT,
    forecastResult: null,
    forecastErrorMessage: "",

    // FE-19: at-risk students
    atRiskStatus: STATUS.DEFAULT,
    atRiskResult: null,
    atRiskErrorMessage: "",

    // FE-19: anomalies
    anomaliesStatus: STATUS.DEFAULT,
    anomaliesResult: null,
    anomaliesErrorMessage: "",

    // FE-19: resolve one anomaly
    resolveAnomalyStatus: STATUS.DEFAULT,
    resolveAnomalyResult: null,
    resolveAnomalyErrorMessage: "",

    // FE-19: dormant cards
    dormantStatus: STATUS.DEFAULT,
    dormantResult: null,
    dormantErrorMessage: "",
};

const analyticsReducer = (state = INITIATE_STATE, action) => {
    switch (action.type) {
        // ---- FE-16: sales ----
        case STATE.ANALYTICS_SALES_REQUEST:
        case STATE.ANALYTICS_SALES_LOADING:
            return {
                ...state,
                salesStatus: STATUS.LOADING,
                salesErrorMessage: "",
            };
        case STATE.ANALYTICS_SALES_SUCCESS:
            return {
                ...state,
                salesStatus: STATUS.SUCCESS,
                salesResult: action.payload,
                salesQuery: action.meta?.filters ?? null,
                salesErrorMessage: "",
            };
        case STATE.ANALYTICS_SALES_FAILURE:
            return {
                ...state,
                salesStatus: STATUS.ERROR,
                salesErrorMessage: action.payload,
            };
        case STATE.ANALYTICS_SALES_RESET:
            return {
                ...state,
                salesStatus: STATUS.DEFAULT,
                salesResult: null,
                salesErrorMessage: "",
                salesQuery: null,
            };

        // ---- FE-17: wallet health ----
        case STATE.ANALYTICS_WALLET_HEALTH_REQUEST:
        case STATE.ANALYTICS_WALLET_HEALTH_LOADING:
            return {
                ...state,
                walletHealthStatus: STATUS.LOADING,
                walletHealthErrorMessage: "",
            };
        case STATE.ANALYTICS_WALLET_HEALTH_SUCCESS:
            return {
                ...state,
                walletHealthStatus: STATUS.SUCCESS,
                walletHealthResult: action.payload,
                walletHealthErrorMessage: "",
            };
        case STATE.ANALYTICS_WALLET_HEALTH_FAILURE:
            return {
                ...state,
                walletHealthStatus: STATUS.ERROR,
                walletHealthErrorMessage: action.payload,
            };
        case STATE.ANALYTICS_WALLET_HEALTH_RESET:
            return {
                ...state,
                walletHealthStatus: STATUS.DEFAULT,
                walletHealthResult: null,
                walletHealthErrorMessage: "",
            };

        // ---- FE-18: operators ----
        case STATE.ANALYTICS_OPERATORS_REQUEST:
        case STATE.ANALYTICS_OPERATORS_LOADING:
            return {
                ...state,
                operatorsStatus: STATUS.LOADING,
                operatorsErrorMessage: "",
            };
        case STATE.ANALYTICS_OPERATORS_SUCCESS:
            return {
                ...state,
                operatorsStatus: STATUS.SUCCESS,
                operatorsResult: action.payload,
                operatorsErrorMessage: "",
            };
        case STATE.ANALYTICS_OPERATORS_FAILURE:
            return {
                ...state,
                operatorsStatus: STATUS.ERROR,
                operatorsErrorMessage: action.payload,
            };
        case STATE.ANALYTICS_OPERATORS_RESET:
            return {
                ...state,
                operatorsStatus: STATUS.DEFAULT,
                operatorsResult: null,
                operatorsErrorMessage: "",
            };

        // ---- FE-18: classes ----
        case STATE.ANALYTICS_CLASSES_REQUEST:
        case STATE.ANALYTICS_CLASSES_LOADING:
            return {
                ...state,
                classesStatus: STATUS.LOADING,
                classesErrorMessage: "",
            };
        case STATE.ANALYTICS_CLASSES_SUCCESS:
            return {
                ...state,
                classesStatus: STATUS.SUCCESS,
                classesResult: action.payload,
                classesErrorMessage: "",
            };
        case STATE.ANALYTICS_CLASSES_FAILURE:
            return {
                ...state,
                classesStatus: STATUS.ERROR,
                classesErrorMessage: action.payload,
            };
        case STATE.ANALYTICS_CLASSES_RESET:
            return {
                ...state,
                classesStatus: STATUS.DEFAULT,
                classesResult: null,
                classesErrorMessage: "",
            };

        // ---- FE-18: penalties ----
        case STATE.ANALYTICS_PENALTIES_REQUEST:
        case STATE.ANALYTICS_PENALTIES_LOADING:
            return {
                ...state,
                penaltiesStatus: STATUS.LOADING,
                penaltiesErrorMessage: "",
            };
        case STATE.ANALYTICS_PENALTIES_SUCCESS:
            return {
                ...state,
                penaltiesStatus: STATUS.SUCCESS,
                penaltiesResult: action.payload,
                penaltiesErrorMessage: "",
            };
        case STATE.ANALYTICS_PENALTIES_FAILURE:
            return {
                ...state,
                penaltiesStatus: STATUS.ERROR,
                penaltiesErrorMessage: action.payload,
            };
        case STATE.ANALYTICS_PENALTIES_RESET:
            return {
                ...state,
                penaltiesStatus: STATUS.DEFAULT,
                penaltiesResult: null,
                penaltiesErrorMessage: "",
            };

        // ---- FE-20: export ----
        case STATE.ANALYTICS_EXPORT_REQUEST:
        case STATE.ANALYTICS_EXPORT_LOADING:
            return {
                ...state,
                exportStatus: STATUS.LOADING,
                exportErrorMessage: "",
            };
        case STATE.ANALYTICS_EXPORT_SUCCESS:
            return {
                ...state,
                exportStatus: STATUS.SUCCESS,
                exportResult: action.payload,
                exportErrorMessage: "",
            };
        case STATE.ANALYTICS_EXPORT_FAILURE:
            return {
                ...state,
                exportStatus: STATUS.ERROR,
                exportErrorMessage: action.payload,
            };
        case STATE.ANALYTICS_EXPORT_RESET:
            return {
                ...state,
                exportStatus: STATUS.DEFAULT,
                exportResult: null,
                exportErrorMessage: "",
            };

        // ---- FE-19: forecast ----
        case STATE.INSIGHTS_FORECAST_REQUEST:
        case STATE.INSIGHTS_FORECAST_LOADING:
            return {
                ...state,
                forecastStatus: STATUS.LOADING,
                forecastErrorMessage: "",
            };
        case STATE.INSIGHTS_FORECAST_SUCCESS:
            return {
                ...state,
                forecastStatus: STATUS.SUCCESS,
                forecastResult: action.payload,
                forecastErrorMessage: "",
            };
        case STATE.INSIGHTS_FORECAST_FAILURE:
            return {
                ...state,
                forecastStatus: STATUS.ERROR,
                forecastErrorMessage: action.payload,
            };
        case STATE.INSIGHTS_FORECAST_RESET:
            return {
                ...state,
                forecastStatus: STATUS.DEFAULT,
                forecastResult: null,
                forecastErrorMessage: "",
            };

        // ---- FE-19: at-risk ----
        case STATE.INSIGHTS_AT_RISK_REQUEST:
        case STATE.INSIGHTS_AT_RISK_LOADING:
            return {
                ...state,
                atRiskStatus: STATUS.LOADING,
                atRiskErrorMessage: "",
            };
        case STATE.INSIGHTS_AT_RISK_SUCCESS:
            return {
                ...state,
                atRiskStatus: STATUS.SUCCESS,
                atRiskResult: action.payload,
                atRiskErrorMessage: "",
            };
        case STATE.INSIGHTS_AT_RISK_FAILURE:
            return {
                ...state,
                atRiskStatus: STATUS.ERROR,
                atRiskErrorMessage: action.payload,
            };
        case STATE.INSIGHTS_AT_RISK_RESET:
            return {
                ...state,
                atRiskStatus: STATUS.DEFAULT,
                atRiskResult: null,
                atRiskErrorMessage: "",
            };

        // ---- FE-19: anomalies ----
        case STATE.INSIGHTS_ANOMALIES_REQUEST:
        case STATE.INSIGHTS_ANOMALIES_LOADING:
            return {
                ...state,
                anomaliesStatus: STATUS.LOADING,
                anomaliesErrorMessage: "",
            };
        case STATE.INSIGHTS_ANOMALIES_SUCCESS:
            return {
                ...state,
                anomaliesStatus: STATUS.SUCCESS,
                anomaliesResult: action.payload,
                anomaliesErrorMessage: "",
            };
        case STATE.INSIGHTS_ANOMALIES_FAILURE:
            return {
                ...state,
                anomaliesStatus: STATUS.ERROR,
                anomaliesErrorMessage: action.payload,
            };
        case STATE.INSIGHTS_ANOMALIES_RESET:
            return {
                ...state,
                anomaliesStatus: STATUS.DEFAULT,
                anomaliesResult: null,
                anomaliesErrorMessage: "",
            };

        // ---- FE-19: resolve one anomaly ----
        case STATE.INSIGHTS_RESOLVE_ANOMALY_REQUEST:
        case STATE.INSIGHTS_RESOLVE_ANOMALY_LOADING:
            return {
                ...state,
                resolveAnomalyStatus: STATUS.LOADING,
                resolveAnomalyErrorMessage: "",
            };
        case STATE.INSIGHTS_RESOLVE_ANOMALY_SUCCESS:
            return {
                ...state,
                resolveAnomalyStatus: STATUS.SUCCESS,
                resolveAnomalyResult: action.payload,
                resolveAnomalyErrorMessage: "",
            };
        case STATE.INSIGHTS_RESOLVE_ANOMALY_FAILURE:
            return {
                ...state,
                resolveAnomalyStatus: STATUS.ERROR,
                resolveAnomalyErrorMessage: action.payload,
            };
        case STATE.INSIGHTS_RESOLVE_ANOMALY_RESET:
            return {
                ...state,
                resolveAnomalyStatus: STATUS.DEFAULT,
                resolveAnomalyResult: null,
                resolveAnomalyErrorMessage: "",
            };

        // ---- FE-19: dormant cards ----
        case STATE.INSIGHTS_DORMANT_REQUEST:
        case STATE.INSIGHTS_DORMANT_LOADING:
            return {
                ...state,
                dormantStatus: STATUS.LOADING,
                dormantErrorMessage: "",
            };
        case STATE.INSIGHTS_DORMANT_SUCCESS:
            return {
                ...state,
                dormantStatus: STATUS.SUCCESS,
                dormantResult: action.payload,
                dormantErrorMessage: "",
            };
        case STATE.INSIGHTS_DORMANT_FAILURE:
            return {
                ...state,
                dormantStatus: STATUS.ERROR,
                dormantErrorMessage: action.payload,
            };
        case STATE.INSIGHTS_DORMANT_RESET:
            return {
                ...state,
                dormantStatus: STATUS.DEFAULT,
                dormantResult: null,
                dormantErrorMessage: "",
            };

        default:
            return state;
    }
};

export default analyticsReducer;
