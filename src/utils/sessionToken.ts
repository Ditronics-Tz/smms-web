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

/** Drops every trace of the previous session from web storage. */
export const clearAllClientStorage = () => {
    clearRefreshToken();
    clearCachedUser();
    try {
        window.localStorage.removeItem('persist:root');
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
