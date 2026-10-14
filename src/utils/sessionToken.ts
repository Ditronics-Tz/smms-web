const REFRESH_KEY = 'smms_refresh_token';

/**
 * FE-03: the refresh token is kept in sessionStorage, never localStorage, and
 * never inside the redux-pisted state. sessionStorage is dropped when the tab
 * closes, so a refresh token cannot outlive the browsing session the way a
 * localStorage one does.
 *
 * The access token is deliberately not stored anywhere — it lives in the redux
 * store (in memory) and is re-obtained from this refresh token on boot.
 */
export const setRefreshToken = (token) => {
    if (!token) return;
    try {
        window.sessionStorage.setItem(REFRESH_KEY, String(token));
    } catch (e) {
        // Private mode / storage disabled: the session simply will not survive
        // a reload, which is the intended fallback.
    }
};

export const getRefreshToken = (): string | null => {
    try {
        return window.sessionStorage.getItem(REFRESH_KEY);
    } catch (e) {
        return null;
    }
};

export const clearRefreshToken = () => {
    try {
        window.sessionStorage.removeItem(REFRESH_KEY);
    } catch (e) {
        // no-op
    }
};

const PERSIST_ROOT_KEY = 'persist:root';

/**
 * FE-03 legacy migration. Builds before FE-03 persisted the whole root store with
 * no blacklist, so an existing browser still has the auth slice — the JWT access
 * token and, inside `loginResult.refresh`, the refresh token — sitting in
 * localStorage under `persist:root`. redux-persist's blacklist only stops future
 * writes; it does not remove what is already stored. Strip the auth slice from
 * the stored blob on boot so no token is left at rest. The store's
 * stateReconciler separately guarantees it can never be rehydrated.
 */
export const scrubPersistedAuth = () => {
    try {
        const raw = window.localStorage.getItem(PERSIST_ROOT_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object') return;
        if (!Object.prototype.hasOwnProperty.call(parsed, 'auth')) return;
        delete parsed.auth;
        window.localStorage.setItem(PERSIST_ROOT_KEY, JSON.stringify(parsed));
    } catch (e) {
        // A corrupt legacy blob is left for redux-persist to time out on; we
        // never delete unrelated persisted slices here.
    }
};

/** Drops every trace of the previous session from web storage. */
export const clearAllClientStorage = () => {
    clearRefreshToken();
    clearCachedUser();
    try {
        window.localStorage.removeItem(PERSIST_ROOT_KEY);
    } catch (e) {
        // no-op
    }
};

const USER_KEY = 'smms_user_cache';

/**
 * The /auth/token/refresh response only carries a new access token, so after a
 * reload there is no way to recover the signed-in user (and therefore no role to
 * render the right routes) from the token alone.
 *
 * This caches ONLY non-sensitive display fields — never a token, password or
 * permission decision is taken from it. The backend is still the authority: a
 * rejected refresh clears the cache and the user is logged out. Refresh-token
 * rotation, revocation and permissions remain server-side.
 */
const USER_FIELDS = [
    'id',
    'first_name',
    'middle_name',
    'last_name',
    'email',
    'mobile_number',
    'profile_picture',
    'role',
    'is_superuser',
] as const;

export const setCachedUser = (user: Record<string, unknown> | null | undefined) => {
    if (!user) return;
    const safe: Record<string, unknown> = {};
    USER_FIELDS.forEach((field) => {
        if (user[field] !== undefined) safe[field] = user[field];
    });
    try {
        window.localStorage.setItem(USER_KEY, JSON.stringify(safe));
    } catch (e) {
        // no-op
    }
};

export const getCachedUser = (): Record<string, unknown> | null => {
    try {
        const raw = window.localStorage.getItem(USER_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (e) {
        return null;
    }
};

export const clearCachedUser = () => {
    try {
        window.localStorage.removeItem(USER_KEY);
    } catch (e) {
        // no-op
    }
};
