import axios from 'axios';
import { API_BASE } from '../constant';
import i18next from 'i18next';
import { toast } from 'react-toastify';

// Guards against a burst of 403s (e.g. a page firing several admin-only calls
// at once) turning into a wall of identical toasts.
let lastForbiddenToastAt = 0;
const FORBIDDEN_TOAST_COOLDOWN_MS = 3000;

const notifyForbidden = () => {
    const now = Date.now();
    if (now - lastForbiddenToastAt < FORBIDDEN_TOAST_COOLDOWN_MS) return;
    lastForbiddenToastAt = now;
    toast.error(i18next.t('errors.notAllowed'));
};

const onSuccess = (response) => {
    return response;
};

const onError = (error) => {
    // 403 means "authenticated but not permitted". The session is still valid,
    // so we surface a message and keep the user logged in. Only 401/TOKEN_ERROR
    // should end the session (handled by the auth saga).
    const status = error?.response?.status;
    if (status === 403) {
        notifyForbidden();
    }

    if (error?.response) {
        return error.response;
    }

    return error?.message ?? {};
}

// Builds "path?k=v" without ever producing a double slash, so callers can pass
// endpoints with or without a trailing slash.
export const withQuery = (url, params = {}) => {
    const [path, existing] = String(url).split('?');
    const query = new URLSearchParams(existing ?? '');

    Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') return;
        if (Array.isArray(value)) {
            if (value.length === 0) return;
            query.set(key, value.join(','));
        } else {
            query.set(key, String(value));
        }
    });

    const base = String(url).endsWith('/') && String(url).length > 1 && !existing
        ? path.slice(0, -1)
        : path;

    const qs = query.toString();
    return qs ? `${base}?${qs}` : base;
};

export const guestRequest = (url, data) => {
    return axios({
        url: API_BASE + url,
        method: "POST",
        timeout: 30000,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        data: data
    })
        .then(onSuccess).catch(onError);
}

export const resourceRequest = (token, url, data) => {
    return axios({
        url: API_BASE + url,
        method: "POST",
        timeout: 30000,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        },
        data
    })
        .then(onSuccess).catch(onError);
}

export const listRequest = (token, url, data, page) => {
    return axios({
        url: API_BASE + withQuery(url, { page }),
        method: "POST",
        timeout: 30000,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        },
        data
    })
        .then(onSuccess).catch(onError);
}

/**
 * GET + query params. Used by the endpoints the backend exposes as REST reads
 * (e.g. /wallet/deposit/list, /ledger/*, /analytics/*).
 */
export const getRequest = (token, url, params) => {
    return axios({
        url: API_BASE + withQuery(url, params),
        method: "GET",
        timeout: 30000,
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token,
        }
    })
        .then(onSuccess).catch(onError);
}

/** GET list with `?page=`, matching the shape listRequest produces. */
export const getListRequest = (token, url, params, page) => {
    return getRequest(token, url, { ...(params ?? {}), page });
}

/** PUT with a JSON body. */
export const putRequest = (token, url, data) => {
    return axios({
        url: API_BASE + url,
        method: "PUT",
        timeout: 30000,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        },
        data
    })
        .then(onSuccess).catch(onError);
}

export function multipartRequest(token, url, formData) {
    return axios({
        url: API_BASE + url,
        method: "POST",
        timeout: 60000,
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token,
        },
        data: formData
    })
        .then(onSuccess).catch(onError);
}
