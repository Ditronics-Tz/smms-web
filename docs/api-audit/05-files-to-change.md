# 5. Files that may need changes

| File | Likely change |
|---|---|
| `src/store/sagas.js` | Add `import analyticsSaga` and `fork(analyticsSaga)` |
| `src/store/reducers.js` | Add `analytics: analyticsReducer` |
| `src/service/*` | Add service functions for the unused endpoints in `03-missing-integrations.md` |
| `src/constant/api.ts` | Add a `/api/v1/` prefix (if the reference requires it) and fix any path names |
| `src/service/calls.ts` | If a shared axios instance + interceptor is desired for base URL / Bearer / refresh |
| `src/utils/fetchPDF.ts` | Align with the shared HTTP client |
| Pages + sagas | Wire up analytics/insights and any newly added service areas |

> None of these edits were made. This is a planning list only.
