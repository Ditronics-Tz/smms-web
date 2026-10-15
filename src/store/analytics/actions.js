import { STATE } from "../../constant";

/**
 * FE-16/17/18 (analytics), FE-19 (insights) and FE-20 (export) action creators.
 *
 * Both families live in one file because they share one store folder and one
 * root saga. Every request action carries { token, ...params } in its payload
 * so a saga can destructure everything it needs from action.payload, exactly
 * like src/store/ledger/actions.js.
 */

// ---- FE-16: sales (group_by lives in filters) ----
export function analyticsSalesRequest(token, filters) {
    return {
        type: STATE.ANALYTICS_SALES_REQUEST,
        payload: { token, filters }
    }
}

export function analyticsSalesReset() {
    return { type: STATE.ANALYTICS_SALES_RESET }
}

// ---- FE-17: wallet health ----
export function analyticsWalletHealthRequest(token) {
    return {
        type: STATE.ANALYTICS_WALLET_HEALTH_REQUEST,
        payload: { token }
    }
}

export function analyticsWalletHealthReset() {
    return { type: STATE.ANALYTICS_WALLET_HEALTH_RESET }
}

// ---- FE-18: operators ----
export function analyticsOperatorsRequest(token, filters) {
    return {
        type: STATE.ANALYTICS_OPERATORS_REQUEST,
        payload: { token, filters }
    }
}

export function analyticsOperatorsReset() {
    return { type: STATE.ANALYTICS_OPERATORS_RESET }
}

// ---- FE-18: classes ----
export function analyticsClassesRequest(token, filters) {
    return {
        type: STATE.ANALYTICS_CLASSES_REQUEST,
        payload: { token, filters }
    }
}

export function analyticsClassesReset() {
    return { type: STATE.ANALYTICS_CLASSES_RESET }
}

// ---- FE-18: penalties ----
export function analyticsPenaltiesRequest(token, filters) {
    return {
        type: STATE.ANALYTICS_PENALTIES_REQUEST,
        payload: { token, filters }
    }
}

export function analyticsPenaltiesReset() {
    return { type: STATE.ANALYTICS_PENALTIES_RESET }
}

// ---- FE-20: export (BE-45 will add the 202 token + poll flow) ----
export function analyticsExportRequest(token, params) {
    return {
        type: STATE.ANALYTICS_EXPORT_REQUEST,
        payload: { token, params }
    }
}

export function analyticsExportReset() {
    return { type: STATE.ANALYTICS_EXPORT_RESET }
}

// ---- FE-19: forecast ----
export function insightsForecastRequest(token, date) {
    return {
        type: STATE.INSIGHTS_FORECAST_REQUEST,
        payload: { token, date }
    }
}

export function insightsForecastReset() {
    return { type: STATE.INSIGHTS_FORECAST_RESET }
}

// ---- FE-19: at-risk students ----
export function insightsAtRiskRequest(token) {
    return {
        type: STATE.INSIGHTS_AT_RISK_REQUEST,
        payload: { token }
    }
}

export function insightsAtRiskReset() {
    return { type: STATE.INSIGHTS_AT_RISK_RESET }
}

// ---- FE-19: anomalies (status: 'open' | 'resolved' | undefined = all) ----
export function insightsAnomaliesRequest(token, status) {
    return {
        type: STATE.INSIGHTS_ANOMALIES_REQUEST,
        payload: { token, status }
    }
}

export function insightsAnomaliesReset() {
    return { type: STATE.INSIGHTS_ANOMALIES_RESET }
}

// ---- FE-19: resolve one anomaly ----
export function insightsResolveAnomalyRequest(token, id, note) {
    return {
        type: STATE.INSIGHTS_RESOLVE_ANOMALY_REQUEST,
        payload: { token, id, note }
    }
}

export function insightsResolveAnomalyReset() {
    return { type: STATE.INSIGHTS_RESOLVE_ANOMALY_RESET }
}

// ---- FE-19: dormant cards ----
export function insightsDormantRequest(token, days) {
    return {
        type: STATE.INSIGHTS_DORMANT_REQUEST,
        payload: { token, days }
    }
}

export function insightsDormantReset() {
    return { type: STATE.INSIGHTS_DORMANT_RESET }
}
