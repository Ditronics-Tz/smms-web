/**
 * Mock switch.
 *
 * Until Ahmed merges BE-28/BE-29 the ledger has no live backend, so the screens
 * are built against mock data shaped EXACTLY like the contract at the bottom of
 * the task PDF:
 *   - lists return { count, next, previous, results }
 *   - amounts are decimal strings ("600.00")
 *   - dates are ISO 8601
 *
 * Turn it on with REACT_APP_USE_MOCKS=true in .env.development (or .env.local).
 * A service returns a mock only when this is true, so switching it off is the
 * whole of the "switch" - no page changes and no code edits.
 *
 * CRA inlines REACT_APP_* at build time, so this is a build-time constant, not
 * something that can be flipped in the browser at runtime.
 */
export const USE_MOCKS = process.env.REACT_APP_USE_MOCKS === 'true';

/**
 * Mimics the shape the sagas receive from the axios helpers in
 * src/service/calls.ts, so a saga cannot tell a mock from a real response and
 * the same code path handles both.
 */
export const mockResponse = <T,>(data: T, status = 200) => ({
    status,
    data,
    // Present so code that logs or inspects the response object does not break
    // on a mock. No page reads these.
    headers: {},
    config: {},
});

/** Standard paginated envelope, matching the backend's list shape. */
export const mockList = <T,>(results: T[], page: number, pageSize: number, url: string) => {
    const count = results.length;
    const pageCount = Math.max(1, Math.ceil(count / pageSize));
    const current = Math.min(Math.max(1, page), pageCount);
    const start = (current - 1) * pageSize;
    const window = results.slice(start, start + pageSize);

    return mockResponse({
        count,
        next: current < pageCount ? `${url}?page=${current + 1}` : null,
        previous: current > 1 ? `${url}?page=${current - 1}` : null,
        results: window,
    });
};

/** Slices a list the same way mockList does, without building the envelope. */
export const paginate = <T,>(results: T[], page: number, pageSize: number) => {
    const pageCount = Math.max(1, Math.ceil(results.length / pageSize));
    const current = Math.min(Math.max(1, page), pageCount);
    const start = (current - 1) * pageSize;
    return results.slice(start, start + pageSize);
};
