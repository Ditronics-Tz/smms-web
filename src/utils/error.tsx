import i18next from "i18next";


const errorMessage = (err) => {
    return i18next.t([`errors.${err}`,'errors.1000']);
}

/**
 * Prefers the message the backend sent with the failure and only falls back to
 * the shared numeric-code table.
 *
 * The older screens call `errorMessage(code)` directly, which is fine when the
 * code alone is meaningful. The newer screens (balance threshold, replace/delete
 * card) are documented against cases the backend explains in words - duplicate
 * card number, card already inactive, card has history - so those surfaces show
 * what the backend actually said and still fall back to a translated message.
 */
export const apiErrorMessage = (data) => {
    const message = data?.message ?? data?.detail;
    if (typeof message === "string" && message.trim() !== "") return message;
    return errorMessage(data?.code);
}

export default errorMessage