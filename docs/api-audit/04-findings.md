# 4. Findings

## 4.1 Biggest finding: Analytics/Insights is built but NOT wired up

The analytics code is new and currently **untracked** in git:

```
?? src/mocks/analytics.ts
?? src/service/analytics/
?? src/store/analytics/
```

But it is not connected to the running app:

- `src/store/sagas.js` forks `auth`, `dashboard`, `user`, `resources`, `session`, `ledger`
  sagas — **but not `analyticsSaga`**, so `src/store/analytics/sagas.js` never runs.
- `src/store/reducers.js` combines six reducers — **but not `analyticsReducer`**, so
  `state.analytics` does not exist.
- No page imports `store/analytics` or dispatches any `ANALYTICS_*` / `INSIGHTS_*` action
  (searched `src/page`).

**Effect:** even though the service functions point at real `/analytics/*` and `/insights/*`
endpoints, no request can ever fire from the UI. It is dead code until wired.

## 4.2 Incorrect / inconsistent request handling (internal)

Since the reference file is missing, these are inconsistencies found in the code itself:

- **`src/utils/fetchPDF.ts` bypasses the shared helpers.** It makes its own
  `axios.get(API_BASE + url)`, sends `Content-Type: multipart/form-data` on a **GET**
  (unusual for a binary/PDF download), and only `console.error`s on failure (no user toast).
- **Trailing-slash inconsistency:** `INACTIVE_USERS_URL` and `NOTIFICATIONS_URL` end with `/`,
  every other constant does not. `withQuery` strips a trailing slash, so this is likely
  harmless but inconsistent.
- **`doDeleteCard` uses a query param (`?force=`) with a POST body.** The code comment itself
  says the parameter name is unconfirmed (`FE-06`).
- **Mixed verbs for list reads:** some use POST `listRequest`, some use GET
  `getListRequest`. Whether each matches the backend verb is unconfirmed.
- **Known role mismatch (acknowledged in code):** `src/service/lookups/index.js` notes that an
  operator opening SessionPage calls admin-only `GET /list/canteen-items` and receives a 403.
  This is deliberately not worked around in the UI.

## 4.3 Notes on error handling

- Auth saga expects an error `code` in the response (`errorMessage(res.data.code)`), while the
  newer analytics/ledger sagas use `apiErrorMessage` (`src/utils/apiErrors.ts`), which prefers
  `message`/`detail` then falls back to a translated code. Two error conventions coexist.
- The `apiErrors` code map references codes that are described in the code as "not final"
  (`BE-02` / `BE-12`).
