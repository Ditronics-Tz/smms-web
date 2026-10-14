import { call, put, takeLatest } from 'redux-saga/effects';
import { STATE } from "../../constant";
import {
    getSales,
    getWalletHealth,
    getOperators,
    getClasses,
    getPenalties,
    exportAnalytics,
    getForecast,
    getAtRisk,
    getAnomalies,
    resolveAnomaly,
    getDormantCards,
} from '../../service/analytics';
import { apiErrorMessage, errorMessage } from '../../utils';

/**
 * FE-16/17/18 (analytics), FE-19 (insights) and FE-20 (export) sagas.
 *
 * Every task follows the pattern in src/store/ledger/sagas.js: LOADING -> call
 * the service -> SUCCESS with res.data as the payload, or FAILURE with a
 * message. The sales task additionally echoes the request filters in `meta`
 * (again like the ledger saga echoes the page): FE-16 sends the same filter set
 * to several group_by calls through this one slice, and the page needs to know
 * which query a response belongs to.
 */

function* salesTask(action) {
    try {
        yield put({ type: STATE.ANALYTICS_SALES_LOADING });

        const { token, filters } = action.payload;

        const res = yield call(getSales, token, filters);

        if (res.status === 200) {
            yield put({
                type: STATE.ANALYTICS_SALES_SUCCESS,
                payload: res.data,
                meta: { filters: filters ?? {} }
            })
        } else {
            yield put({
                type: STATE.ANALYTICS_SALES_FAILURE,
                payload: res.data ? apiErrorMessage(res.data) : errorMessage(1000)
            })
        }
    } catch (e) {
        yield put({
            type: STATE.ANALYTICS_SALES_FAILURE,
            payload: apiErrorMessage(e?.data ?? e)
        })
    }
}

function* walletHealthTask(action) {
    try {
        yield put({ type: STATE.ANALYTICS_WALLET_HEALTH_LOADING });

        const { token } = action.payload;

        const res = yield call(getWalletHealth, token);

        if (res.status === 200) {
            yield put({
                type: STATE.ANALYTICS_WALLET_HEALTH_SUCCESS,
                payload: res.data
            })
        } else {
            yield put({
                type: STATE.ANALYTICS_WALLET_HEALTH_FAILURE,
                payload: res.data ? apiErrorMessage(res.data) : errorMessage(1000)
            })
        }
    } catch (e) {
        yield put({
            type: STATE.ANALYTICS_WALLET_HEALTH_FAILURE,
            payload: apiErrorMessage(e?.data ?? e)
        })
    }
}

function* operatorsTask(action) {
    try {
        yield put({ type: STATE.ANALYTICS_OPERATORS_LOADING });

        const { token, filters } = action.payload;

        const res = yield call(getOperators, token, filters);

        if (res.status === 200) {
            yield put({
                type: STATE.ANALYTICS_OPERATORS_SUCCESS,
                payload: res.data
            })
        } else {
            yield put({
                type: STATE.ANALYTICS_OPERATORS_FAILURE,
                payload: res.data ? apiErrorMessage(res.data) : errorMessage(1000)
            })
        }
    } catch (e) {
        yield put({
            type: STATE.ANALYTICS_OPERATORS_FAILURE,
            payload: apiErrorMessage(e?.data ?? e)
        })
    }
}

function* classesTask(action) {
    try {
        yield put({ type: STATE.ANALYTICS_CLASSES_LOADING });

        const { token, filters } = action.payload;

        const res = yield call(getClasses, token, filters);

        if (res.status === 200) {
            yield put({
                type: STATE.ANALYTICS_CLASSES_SUCCESS,
                payload: res.data
            })
        } else {
            yield put({
                type: STATE.ANALYTICS_CLASSES_FAILURE,
                payload: res.data ? apiErrorMessage(res.data) : errorMessage(1000)
            })
        }
    } catch (e) {
        yield put({
            type: STATE.ANALYTICS_CLASSES_FAILURE,
            payload: apiErrorMessage(e?.data ?? e)
        })
    }
}

function* penaltiesTask(action) {
    try {
        yield put({ type: STATE.ANALYTICS_PENALTIES_LOADING });

        const { token, filters } = action.payload;

        const res = yield call(getPenalties, token, filters);

        if (res.status === 200) {
            yield put({
                type: STATE.ANALYTICS_PENALTIES_SUCCESS,
                payload: res.data
            })
        } else {
            yield put({
                type: STATE.ANALYTICS_PENALTIES_FAILURE,
                payload: res.data ? apiErrorMessage(res.data) : errorMessage(1000)
            })
        }
    } catch (e) {
        yield put({
            type: STATE.ANALYTICS_PENALTIES_FAILURE,
            payload: apiErrorMessage(e?.data ?? e)
        })
    }
}

function* exportTask(action) {
    try {
        yield put({ type: STATE.ANALYTICS_EXPORT_LOADING });

        const { token, params } = action.payload;

        // BE-45 will turn this into a 202 + token and a poll at
        // ANALYTICS_EXPORT_URL; the CSV itself is built in the browser today.
        const res = yield call(exportAnalytics, token, params);

        if (res.status === 200) {
            yield put({
                type: STATE.ANALYTICS_EXPORT_SUCCESS,
                payload: res.data
            })
        } else {
            yield put({
                type: STATE.ANALYTICS_EXPORT_FAILURE,
                payload: res.data ? apiErrorMessage(res.data) : errorMessage(1000)
            })
        }
    } catch (e) {
        yield put({
            type: STATE.ANALYTICS_EXPORT_FAILURE,
            payload: apiErrorMessage(e?.data ?? e)
        })
    }
}

function* forecastTask(action) {
    try {
        yield put({ type: STATE.INSIGHTS_FORECAST_LOADING });

        const { token, date } = action.payload;

        const res = yield call(getForecast, token, date);

        if (res.status === 200) {
            yield put({
                type: STATE.INSIGHTS_FORECAST_SUCCESS,
                payload: res.data
            })
        } else {
            yield put({
                type: STATE.INSIGHTS_FORECAST_FAILURE,
                payload: res.data ? apiErrorMessage(res.data) : errorMessage(1000)
            })
        }
    } catch (e) {
        yield put({
            type: STATE.INSIGHTS_FORECAST_FAILURE,
            payload: apiErrorMessage(e?.data ?? e)
        })
    }
}

function* atRiskTask(action) {
    try {
        yield put({ type: STATE.INSIGHTS_AT_RISK_LOADING });

        const { token } = action.payload;

        const res = yield call(getAtRisk, token);

        if (res.status === 200) {
            yield put({
                type: STATE.INSIGHTS_AT_RISK_SUCCESS,
                payload: res.data
            })
        } else {
            yield put({
                type: STATE.INSIGHTS_AT_RISK_FAILURE,
                payload: res.data ? apiErrorMessage(res.data) : errorMessage(1000)
            })
        }
    } catch (e) {
        yield put({
            type: STATE.INSIGHTS_AT_RISK_FAILURE,
            payload: apiErrorMessage(e?.data ?? e)
        })
    }
}

function* anomaliesTask(action) {
    try {
        yield put({ type: STATE.INSIGHTS_ANOMALIES_LOADING });

        const { token, status } = action.payload;

        const res = yield call(getAnomalies, token, status);

        if (res.status === 200) {
            yield put({
                type: STATE.INSIGHTS_ANOMALIES_SUCCESS,
                payload: res.data
            })
        } else {
            yield put({
                type: STATE.INSIGHTS_ANOMALIES_FAILURE,
                payload: res.data ? apiErrorMessage(res.data) : errorMessage(1000)
            })
        }
    } catch (e) {
        yield put({
            type: STATE.INSIGHTS_ANOMALIES_FAILURE,
            payload: apiErrorMessage(e?.data ?? e)
        })
    }
}

function* resolveAnomalyTask(action) {
    try {
        yield put({ type: STATE.INSIGHTS_RESOLVE_ANOMALY_LOADING });

        const { token, id, note } = action.payload;

        const res = yield call(resolveAnomaly, token, id, note);

        if (res.status === 200) {
            yield put({
                type: STATE.INSIGHTS_RESOLVE_ANOMALY_SUCCESS,
                payload: res.data
            })
        } else {
            yield put({
                type: STATE.INSIGHTS_RESOLVE_ANOMALY_FAILURE,
                payload: res.data ? apiErrorMessage(res.data) : errorMessage(1000)
            })
        }
    } catch (e) {
        yield put({
            type: STATE.INSIGHTS_RESOLVE_ANOMALY_FAILURE,
            payload: apiErrorMessage(e?.data ?? e)
        })
    }
}

function* dormantTask(action) {
    try {
        yield put({ type: STATE.INSIGHTS_DORMANT_LOADING });

        const { token, days } = action.payload;

        const res = yield call(getDormantCards, token, days);

        if (res.status === 200) {
            yield put({
                type: STATE.INSIGHTS_DORMANT_SUCCESS,
                payload: res.data
            })
        } else {
            yield put({
                type: STATE.INSIGHTS_DORMANT_FAILURE,
                payload: res.data ? apiErrorMessage(res.data) : errorMessage(1000)
            })
        }
    } catch (e) {
        yield put({
            type: STATE.INSIGHTS_DORMANT_FAILURE,
            payload: apiErrorMessage(e?.data ?? e)
        })
    }
}

export default function* analyticsSaga() {
    yield takeLatest(STATE.ANALYTICS_SALES_REQUEST, salesTask);
    yield takeLatest(STATE.ANALYTICS_WALLET_HEALTH_REQUEST, walletHealthTask);
    yield takeLatest(STATE.ANALYTICS_OPERATORS_REQUEST, operatorsTask);
    yield takeLatest(STATE.ANALYTICS_CLASSES_REQUEST, classesTask);
    yield takeLatest(STATE.ANALYTICS_PENALTIES_REQUEST, penaltiesTask);
    yield takeLatest(STATE.ANALYTICS_EXPORT_REQUEST, exportTask);
    yield takeLatest(STATE.INSIGHTS_FORECAST_REQUEST, forecastTask);
    yield takeLatest(STATE.INSIGHTS_AT_RISK_REQUEST, atRiskTask);
    yield takeLatest(STATE.INSIGHTS_ANOMALIES_REQUEST, anomaliesTask);
    yield takeLatest(STATE.INSIGHTS_RESOLVE_ANOMALY_REQUEST, resolveAnomalyTask);
    yield takeLatest(STATE.INSIGHTS_DORMANT_REQUEST, dormantTask);
}
