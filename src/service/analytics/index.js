import {
    ANALYTICS_SALES_URL,
    ANALYTICS_WALLET_HEALTH_URL,
    ANALYTICS_OPERATORS_URL,
    ANALYTICS_CLASSES_URL,
    ANALYTICS_PENALTIES_URL,
    ANALYTICS_EXPORT_URL,
    INSIGHTS_FORECAST_URL,
    INSIGHTS_AT_RISK_URL,
    INSIGHTS_ANOMALIES_URL,
    INSIGHTS_DORMANT_URL,
    insightsResolveAnomalyUrl,
} from '../../constant';
import { getRequest, resourceRequest } from '../calls';
import { USE_MOCKS, mockResponse } from '../../mocks';
import {
    filterSales,
    filterAnomalies,
    filterDormantCards,
    resolveAnomalyMock,
    WALLET_HEALTH_MOCK,
    OPERATORS_MOCK,
    CLASSES_MOCK,
    PENALTIES_MOCK,
    FORECAST_MOCK,
    AT_RISK_MOCK,
} from '../../mocks/analytics';

/**
 * FE-16/17/18 (analytics), FE-19 (insights) and FE-20 (export) reads.
 *
 * Mirrors src/service/ledger/index.js: when USE_MOCKS is on the mock answers
 * with exactly the BE-42/BE-43 contract shape, otherwise the request goes to
 * the live endpoint with the same query parameter names, so no page or saga
 * can tell which path it took.
 *
 * Both families live in one file because they share one page-level filter bar
 * and one store slice folder — splitting them would only move imports around.
 *
 * Query parameters are passed straight through (from, to, meal_type, group_by,
 * status, date, days) and the mocks filter on exactly the same names, so the
 * mocks cannot drift into a second set of rules.
 */

/** GET /analytics/sales?from&to&meal_type&group_by=day|item|hour  (admin) */
export const getSales = (token, filters = {}) => {
    if (USE_MOCKS) {
        return Promise.resolve(mockResponse(filterSales(filters)));
    }
    return getRequest(token, ANALYTICS_SALES_URL, filters);
};

/** GET /analytics/wallet-health  (admin) */
export const getWalletHealth = (token) => {
    if (USE_MOCKS) {
        return Promise.resolve(mockResponse(WALLET_HEALTH_MOCK));
    }
    return getRequest(token, ANALYTICS_WALLET_HEALTH_URL);
};

/** GET /analytics/operators?from&to  (admin) */
export const getOperators = (token, filters = {}) => {
    if (USE_MOCKS) {
        return Promise.resolve(mockResponse(OPERATORS_MOCK));
    }
    return getRequest(token, ANALYTICS_OPERATORS_URL, filters);
};

/** GET /analytics/classes?from&to  (admin) */
export const getClasses = (token, filters = {}) => {
    if (USE_MOCKS) {
        return Promise.resolve(mockResponse(CLASSES_MOCK));
    }
    return getRequest(token, ANALYTICS_CLASSES_URL, filters);
};

/** GET /analytics/penalties?from&to  (admin) */
export const getPenalties = (token, filters = {}) => {
    if (USE_MOCKS) {
        return Promise.resolve(mockResponse(PENALTIES_MOCK));
    }
    return getRequest(token, ANALYTICS_PENALTIES_URL, filters);
};

/**
 * FE-20 — the slice behind the Export (CSV) buttons.
 *
 * Today the browser builds the CSV itself (src/utils/downloadCsv.ts) so the
 * buttons work while the mocks are on. BE-45's real export answers 202 with a
 * token that is then polled at ANALYTICS_EXPORT_URL; when that lands only this
 * function (and the polling) changes — the buttons and the slice stay as they
 * are.
 */
export const exportAnalytics = (token, params = {}) => {
    if (USE_MOCKS) {
        return Promise.resolve(mockResponse({ requested: true, ...params }));
    }
    return getRequest(token, ANALYTICS_EXPORT_URL, params);
};

/** GET /insights/forecast?date  (admin) */
export const getForecast = (token, date) => {
    if (USE_MOCKS) {
        return Promise.resolve(mockResponse(FORECAST_MOCK));
    }
    return getRequest(token, INSIGHTS_FORECAST_URL, { date });
};

/** GET /insights/at-risk  (admin) */
export const getAtRisk = (token) => {
    if (USE_MOCKS) {
        return Promise.resolve(mockResponse(AT_RISK_MOCK));
    }
    return getRequest(token, INSIGHTS_AT_RISK_URL);
};

/**
 * GET /insights/anomalies?status=open|resolved  (admin)
 * An omitted status asks for every anomaly — that is what the "Show resolved"
 * toggle on FE-19 sends.
 */
export const getAnomalies = (token, status) => {
    if (USE_MOCKS) {
        return Promise.resolve(mockResponse(filterAnomalies(status)));
    }
    return getRequest(token, INSIGHTS_ANOMALIES_URL, { status });
};

/** POST /insights/anomalies/{id}/resolve  body { note }  (admin) */
export const resolveAnomaly = (token, id, note) => {
    if (USE_MOCKS) {
        const updated = resolveAnomalyMock(id);
        return updated
            ? Promise.resolve(mockResponse(updated))
            : Promise.resolve(mockResponse({ detail: 'Not found' }, 404));
    }
    return resourceRequest(token, insightsResolveAnomalyUrl(id), { note });
};

/** GET /insights/dormant-cards?days=30  (admin) */
export const getDormantCards = (token, days = 30) => {
    if (USE_MOCKS) {
        return Promise.resolve(mockResponse(filterDormantCards(Number(days) || 30)));
    }
    return getRequest(token, INSIGHTS_DORMANT_URL, { days });
};
