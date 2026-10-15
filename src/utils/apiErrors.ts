import i18next from "i18next";

/**
 * FE-07 — translated error messages for scan / wallet / top-up / reverse.
 *
 * Until BE-02 / BE-12 are merged Ahmed's error codes are not final, so this map
 * is the single place to align a code with a translated message. Every UI that
 * can receive one of these errors calls getApiErrorMessage() and never renders
 * raw backend text.
 *
 * The i18n keys live under `apiErrors.<CODE>` in en.json / sw.json. An unknown
 * code falls back to `apiErrors.generic`.
 */

export const API_ERROR_CODES = {
    INSUFFICIENT_BALANCE_PENALTY: "INSUFFICIENT_BALANCE_PENALTY",
    CARD_BLOCKED_STRIKES: "CARD_BLOCKED_STRIKES",
    DUPLICATE_ITEM_IN_SESSION: "DUPLICATE_ITEM_IN_SESSION",
    CARD_INACTIVE: "CARD_INACTIVE",
    SESSION_NOT_ACTIVE: "SESSION_NOT_ACTIVE",
    DAILY_LIMIT: "DAILY_LIMIT",
    ITEM_BLOCKED: "ITEM_BLOCKED",
} as const;

const GENERIC_KEY = "apiErrors.generic";

/** Returns the i18next lookup array: the code's own key, then the generic one. */
export const errorCodeToKey = (code: string) => {
    if (!code) return [GENERIC_KEY];
    return [`apiErrors.${code}`, GENERIC_KEY];
};

export const translateErrorCode = (code: string, t = i18next.t.bind(i18next)) =>
    t(errorCodeToKey(code));

/**
 * Prefers a message the backend actually sent (message / detail) and only then
 * falls back to the translated code map. Accepts either a full axios error
 * object or a bare response body.
 */
export const getApiErrorMessage = (err: unknown, t = i18next.t.bind(i18next)) => {
    const data = (err as any)?.data ?? err ?? {};
    const message = data?.message ?? data?.detail;
    if (typeof message === "string" && message.trim() !== "") return message;
    return translateErrorCode(data?.code, t);
};

/** Labels a scan result by its outcome so the Session page can render the
 * success / penalty / blocked states from FE-07. */
export const classifyScanResult = (code: string) => {
    if (code === API_ERROR_CODES.CARD_BLOCKED_STRIKES) return "blocked";
    if (code === API_ERROR_CODES.INSUFFICIENT_BALANCE_PENALTY) return "penalty";
    return "error";
};

export default getApiErrorMessage;