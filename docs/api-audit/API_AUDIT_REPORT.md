# SMMS Frontend — Complete API Integration Audit

> **Critical finding before anything else:** `API_COMPLETE_REFERENCE.md` **does not exist** anywhere in this repo (searched the whole project, including untracked/deleted files via git). The task says to use it as the API contract, but there is no contract file to compare against. Therefore every "expected endpoint/body/response" item below is marked **unconfirmed** unless it can be verified from code + in-code comments. A pre-existing audit already lives in `docs/api-audit/` (untracked); it was verified against the source and is accurate, and this report adds findings it missed.

---

## 1. Executive summary

| Area | Status |
|---|---|
| HTTP client | Working but unusual: **per-call `axios` calls, no shared instance, no interceptor** (`src/service/calls.ts`). |
| Base URL | Env-driven (`REACT_APP_API_BASE_URL`), no `/api/v1/` prefix anywhere. Dev fallback = localhost; prod intentionally blank + loud warning. |
| Auth | Login / refresh / logout implemented. Access token in memory, refresh token in `sessionStorage`. Logout calls the API **outside** the saga. |
| Endpoint coverage | ~74 service functions across 8 modules. All use flat paths built from `API_BASE`. |
| Biggest issue | **Analytics + Insights are fully built but never wired** — saga not forked, reducer not combined, no page/route. Dead code that can never fire. |
| Second issue | A large body of **action-types, URL constants and route constants exist with no service/saga/page wiring** (menu, mobile-money top-up, parent controls, integrations, reconciliation, refund, strike reset). |
| Security | Token storage design is deliberate and sound, **but** login and change-password handlers `console.log` plaintext passwords. PDF fetch sends a multipart header on a GET. |
| Tests | Only 3 unit tests (`sessionToken`, `formatMoney`, `mocks/ledger`). **Zero tests for HTTP/auth/sagas.** |
| Files changed | This audit itself modified nothing; the report is a new documentation file only. |

Because the contract file is missing, correct paths, verbs, bodies and response shapes **cannot be confirmed** — they require the backend team or the supervisor (see §9).

---

## 2. API configuration findings

| Item | Finding | Evidence |
|---|---|---|
| Base URL | Read from `REACT_APP_API_BASE_URL` at build time. `API_BASE` resolved in `src/constant/api.ts:9-32`. | `.env.development` = `http://127.0.0.1:8000`; `.env.production` blank. |
| Dev fallback | Non-production falls back to `http://127.0.0.1:8000`. | `api.ts:15-18` |
| Prod fallback | None. Logs a loud `console.error` and returns `''`. | `api.ts:19-30` |
| `/api/v1/` prefix | **Not present anywhere.** All URLs are flat (`/auth/login`, `/dashboard/counts` …). | grep for `api/v1` → 0 matches |
| `FILE_BASE` | Same value as `API_BASE`. | `api.ts:35` |
| Axios usage | Each helper builds its own request; **no shared instance, no request/response interceptor, no automatic retry/refresh**. | `src/service/calls.ts` |
| Error handling | `onError` **returns `error.response`** (does not re-throw). Only `403` triggers a throttled toast (3 s cooldown). `401`/network errors fall through to callers/sagas. | `calls.ts:22-36` |
| Bearer token | Passed as an argument per call; header set manually in `calls.ts` and `fetchPDF.ts`. | `calls.ts:84,99,117,137,151`; `fetchPDF.ts:11` |
| Timeouts | **30 s** for JSON/GET/PUT; **60 s** for multipart uploads. | `calls.ts:66,80,95,114,133,148` |
| Pagination | `listRequest` (POST) appends `?page=`; `getListRequest` (GET) appends `page` via `withQuery`. Arrays are comma-joined. | `calls.ts:40-60,91-126` |
| Query params | `withQuery` skips `undefined/null/''`, joins arrays with `,`, strips a trailing slash. | `calls.ts:40-60` |
| PDF | `fetchPDF` makes a raw `axios.get` with `Content-Type: multipart/form-data` (unusual on GET) and `responseType: 'blob'`; **only `console.error`s on failure** (no user feedback). | `src/utils/fetchPDF.ts` |
| Mocks | `USE_MOCKS = REACT_APP_USE_MOCKS === 'true'` (build-time). Ledger + Analytics/Insights services branch on it. `.env.development` has it **true**. | `src/mocks/index.ts:18` |

---

## 3. Endpoint-by-endpoint comparison

All paths come from `src/constant/api.ts`. "Expected" is **unconfirmed** because the reference file is absent — the status column states what the code *believes* and where that belief is documented.

### 3.1 Authentication — `src/service/auth/index.js`

| Function | Verb + path | Expected per reference | Status |
|---|---|---|---|
| `doLogin` | POST `/auth/login` | Unconfirmed | Implemented |
| `doLogout` | POST `/auth/logout` | Unconfirmed | Implemented (called outside saga — see §5) |
| `doRefreshToken` | POST `/auth/token/refresh` | Unconfirmed | Implemented |
| `doCreateUser` | POST `/auth/create-user` (multipart) | Unconfirmed | Implemented |
| `doEditUser` | POST `/auth/edit-user` (multipart) | Unconfirmed | Implemented |
| `doActivateUser` | POST `/auth/activate-deactivate-user` | Unconfirmed | Implemented |
| `doForgotPassword` | POST `/auth/forgot-password` | Unconfirmed | Implemented |
| `doConfirmPasswordReset` | POST `/auth/reset-password/confirm` | Unconfirmed | Implemented |
| `doChangePassword` | POST `/auth/change-password` | Unconfirmed | Implemented |
| `doImportPreview` | POST `/imports/upload` (multipart) | Unconfirmed | Implemented |
| `doImportCommit` | POST `/imports/commit` (multipart) | Unconfirmed | Implemented |

### 3.2 Dashboard — `src/service/dashboard/index.js`

| Function | Verb + path | Status |
|---|---|---|
| `doCounts` | POST `/dashboard/counts` | Implemented (POST assumed) |
| `doSalesSummary` | POST `/dashboard/sales-summary` | Implemented |
| `doSalesTrend` | POST `/dashboard/sales-trend` | Implemented |
| `doLastSession` | POST `/dashboard/last-session` | Implemented |
| `doParentStudents` | POST `/dashboard/parent-students` | Implemented |
| `doStaffView` | POST `/dashboard/staff-view` | Implemented |
| `doChildSpend` | POST `/dashboard/children-spend` | Implemented |
| `doBalanceThreshold` | GET `/dashboard/balance-threshold` | Implemented |
| `doSetBalanceThreshold` | PUT `/dashboard/balance-threshold` (body `{ balance_threshold }`) | Implemented |

### 3.3 Resources — `src/service/resources/index.js`

| Function | Verb + path | Status |
|---|---|---|
| `doCreateSchool` | POST `/resources/create-school` | Implemented |
| `doSchoolList` | POST `/resources/school-list?page=` | Implemented |
| `doDeleteSchool` | POST `/resources/delete-school` | Implemented |
| `doCreateItem` | POST `/resources/create-item` | Implemented |
| `doItemList` | POST `/resources/item-list?page=` | Implemented |
| `doEditItem` | POST `/resources/edit-item` | Implemented |
| `doDeleteItem` | POST `/resources/delete-item` | Implemented |
| `doCreateCard` | POST `/resources/create-card` | Implemented |
| `doCardList` | POST `/resources/card-list?page=` | Implemented |
| `doEditCard` | POST `/resources/edit-card` | Implemented |
| `doCardDetails` | POST `/resources/card-details` | Implemented |
| `doActivateCard` | POST `/resources/activate-deactivate-card` | Implemented |
| `doReplaceCard` | POST `/resources/replace-card` (body `{ old_card_id, new_card_number, reason, carry_balance }`) | Implemented |
| `doDeleteCard` | POST `/resources/delete-card?force=true` (body `{ card_id }`) | Implemented; **param name `force` marked FE-06 unconfirmed in code** |
| `doNotification` | POST `/resources/notifications/` (trailing slash) | Implemented; slash inconsistent |
| `doAllNotifications` | POST `/resources/all-notifications?page=` | Implemented |

### 3.4 Sessions / Wallet — `src/service/sessions/index.js`

| Function | Verb + path | Status |
|---|---|---|
| `doScanCard` | POST `/sessions/scan-card` | Implemented |
| `doStartSession` | POST `/sessions/start-session` | Implemented |
| `doEndSession` | POST `/sessions/end-session` | Implemented |
| `doSessionList` | POST `/sessions/session-list` | Implemented (not paginated) |
| `doScannedList` | POST `/sessions/scanned-data?page=` | Implemented |
| `doTransactions` | POST `/sessions/transaction-list?page=` | Implemented |
| `doReverseTransaction` | POST `/wallet/transaction/reverse` | Implemented |
| `doDepositRequest` | POST `/wallet/deposit/create` | Implemented |
| `doDepositList` | GET `/wallet/deposit/list?page=` | Implemented |

### 3.5 User — `src/service/user/index.js`

| Function | Verb + path | Status |
|---|---|---|
| `doUserList` | POST `/resources/users-list?page=` | Implemented |
| `doInactiveUsers` | POST `/resources/inactive-users-list/?page=` | Implemented; trailing slash inconsistent |
| `doStudentDetails` | POST `/resources/student-details` | Implemented |
| `doAdminDetails` | POST `/resources/admin-details` | Implemented |
| `doParentDetails` | POST `/resources/parent-details` | Implemented |
| `doOperatorDetails` | POST `/resources/operator-details` | Implemented |
| `doStaffDetails` | POST `/resources/staff-details` | Implemented |

### 3.6 Lookups — `src/service/lookups/index.js` (all GET)

| Function | Path | Status |
|---|---|---|
| `doListStudents` | GET `/list/students` | Implemented |
| `doListStaffs` | GET `/list/staffs` | Implemented |
| `doListSchools` | GET `/list/schools` | Implemented |
| `doListParents` | GET `/list/parents` | Implemented |
| `doListCanteenItems` | GET `/list/canteen-items` | Implemented; **operator caller gets 403 (documented mismatch)** |
| `doActiveSession` | GET `/sessions/active-session` | Implemented |

### 3.7 Ledger — `src/service/ledger/index.js` (read-only, mock-backed)

| Function | Verb + path | Status |
|---|---|---|
| `getJournal` | GET `/ledger/journal?from&to&event_type&card_number&account&page` | Implemented |
| `getJournalEntry` | GET `/ledger/journal/{entry_id}` | Implemented |
| `getCardStatement` | GET `/ledger/cards/{card_id}/statement?from&to&page` | Implemented |
| `getAccountStatement` | GET `/ledger/accounts/{code}/statement?from&to&page` | Implemented |
| `getTrialBalance` | GET `/ledger/trial-balance?as_of` | Implemented |
| `getIntegrity` | GET `/ledger/integrity` | Implemented |
| `isEntryBalanced` | client-side only | Implemented |

### 3.8 Analytics / Insights — `src/service/analytics/index.js` **NOT WIRED**

| Function | Verb + path | Status |
|---|---|---|
| `getSales` | GET `/analytics/sales` | Service exists; **never called** |
| `getWalletHealth` | GET `/analytics/wallet-health` | Service exists; **never called** |
| `getOperators` | GET `/analytics/operators` | Service exists; **never called** |
| `getClasses` | GET `/analytics/classes` | Service exists; **never called** |
| `getPenalties` | GET `/analytics/penalties` | Service exists; **never called** |
| `exportAnalytics` | GET `/analytics/export` | Service exists; **never called** |
| `getForecast` | GET `/insights/forecast?date` | Service exists; **never called** |
| `getAtRisk` | GET `/insights/at-risk` | Service exists; **never called** |
| `getAnomalies` | GET `/insights/anomalies?status` | Service exists; **never called** |
| `resolveAnomaly` | POST `/insights/anomalies/{id}/resolve` body `{ note }` | Service exists; **never called** |
| `getDormantCards` | GET `/insights/dormant-cards?days=30` | Service exists; **never called** |

**Proof it is not wired:** `src/store/sagas.js` forks only auth/dashboard/user/resources/session/ledger; `src/store/reducers.js` combines only those six; `src/store/actions.js` re-exports only those six action modules; grep of `src/page` for `analytics|insights` → **0 matches**; `Routes.tsx` has no analytics/insights route.

---

## 4. Missing integrations

These **URL constants are defined but never imported by any service** (candidate new work), plus route/action scaffolding that exists with no UI:

| Constant(s) | URL | Area | Action type(s) defined? | Route defined? |
|---|---|---|---|---|
| `RESET_STRIKES_URL` | `/resources/reset-strikes` | Card strikes | `RESET_STRIKES` | no |
| `TOPUP_INITIATE_URL`, `TOPUP_STATUS_URL`, `topupStatusUrl(id)` | `/payments/topup/initiate`, `/payments/topup`, `/payments/topup/{id}` | Mobile-money top-up | `TOPUP_INITIATE`, `TOPUP_STATUS` | no |
| `MENU_URL`, `MENU_TODAY_URL` | `/menu`, `/menu/today` | Daily menu | `MENU_LIST`, `MENU_UPDATE` | `NAVIGATE_TO_MENUPAGE` (unregistered) |
| `PARENT_LIMITS_URL`, `PARENT_BLOCKS_URL` | `/dashboard/student-limits`, `/dashboard/item-blocks` | Parent controls | `PARENT_LIMITS`, `SET_PARENT_LIMIT`, `PARENT_BLOCKS`, `SET_PARENT_BLOCK` | no |
| `INTEGRATIONS_API_KEYS_URL`, `INTEGRATIONS_WEBHOOKS_URL`, `INTEGRATIONS_SYNC_LOG_URL` | `/integrations/*` | Integrations | `API_KEYS`, `CREATE_API_KEY`, `REVOKE_API_KEY`, `WEBHOOKS`, `UPDATE_WEBHOOK`, `SYNC_LOG` | `NAVIGATE_TO_INTEGRATIONSPAGE` (unregistered) |
| `RECONCILIATION_UPLOAD_URL`, `RECONCILIATION_RESOLVE_URL` | `/reconciliation/*` | Reconciliation | `RECON_UPLOAD`, `RECON_RESOLVE` | `NAVIGATE_TO_RECONCILIATIONPAGE` (unregistered) |
| `REFUND_URL` | `/wallet/transaction/refund` | Refunds | `REFUND` | no |
| `NAVIGATE_TO_ANALYTICSPAGE`, `NAVIGATE_TO_INSIGHTSPAGE` | `/analytics`, `/insights` | FE-16/17/18/19 | (analytics actions exist) | unregistered |

**Interpretation:** The `BE-*` comments and the fact that URL constants *and* action types *and* route constants were pre-created strongly suggests these are **intentional scaffolding for future backend tickets**, not accidental omissions. The exception is **Analytics/Insights**, which is fully implemented end-to-end (service + saga + reducer + mocks) and only needs 3 lines of wiring — that one is most likely an accidental gap, not intentional.

Distinguish:
- **Genuinely missing (build the whole slice + page):** menu, top-up, parent controls, integrations, reconciliation, refund, reset-strikes.
- **Built but not wired (finish the wiring):** analytics + insights.
- **Possibly intentionally unused:** everything else in this table unless a product ticket says otherwise.

---

## 5. Authentication findings

| Topic | Finding |
|---|---|
| Login | `POST /auth/login`. Saga `loginTask` expects HTTP 200 and reads `res.data.refresh` + `res.data.user`, then stores refresh token (`sessionStorage`) and caches display user. |
| Access token | Held **in memory only** in redux (`auth.accessToken`); `auth` slice is **blacklisted** from redux-persist. Intentional (FE-03). |
| Refresh token | Stored in `sessionStorage` (`smms_refresh_token`), never localStorage. Good. |
| Boot / reload | `App.tsx` reads refresh token on boot and calls `/auth/token/refresh` **before** rendering protected routes; loading screen shown meanwhile. |
| Refresh rotation | New refresh token is stored **only if** the response contains one (`tokenTask`). Reasonable. |
| Proactive refresh | `App.tsx` decodes the JWT every 30 s and refreshes near expiry via `parseJwt`. Uses `atob` on payload. |
| Refresh failure | Clears all client storage and fails the token → `tokenTask` sets `TOKEN_FAILURE`; `App.tsx` warns, calls `doLogout`, resets token, dispatches logout. |
| Logout | `doLogout(LOGOUT_URL)` is called **directly from components** (`Header.tsx:103`, `App.tsx:111`), *not* through the saga. The saga's `logoutTask` only clears storage. **No awaited response; failure is ignored.** |
| Login error mapping | Saga uses `errorMessage(res.data.code)` (numeric code → i18n). Analytics/ledger sagas use `apiErrorMessage` (`message`/`detail` first). **Two error conventions coexist.** |
| Cached user | Only non-sensitive fields (`id, name, email, mobile, profile_picture, role, is_superuser`) cached in localStorage. No token/permission decision from it. Good. |
| Role guards | Route-level guards use `userRole` and `isSuperuser` from cached/login user. Server is still authority. |

---

## 6. Security & reliability concerns

| # | Severity | Concern | Location |
|---|---|---|---|
| S1 | **High** | Login handler logs the full request object including **plaintext password** and `fcm_token` to the browser console. | `src/page/Login/pages/LoginPage.tsx:72` |
| S2 | **High** | Change-password handler logs **old/new/confirm passwords** to the console. | `src/page/Profile/pages/ProfilePage.tsx:69` |
| S3 | Medium | FCM registration token is logged to console (`console.log("FCM Token:", token)`). | `src/firebase/firebase.js:115` |
| S4 | Medium | Forgot-password logs the email; login/forgot/profile log the raw submit object. | `ForgetPasswordPage.tsx:75`, others |
| S5 | Medium | `fetchPDF` sends `Content-Type: multipart/form-data` on a **GET** and swallows errors with only `console.error` — user gets no feedback. | `src/utils/fetchPDF.ts:8-31` |
| S6 | Medium | No shared axios instance/interceptor means **no automatic 401 refresh/retry** and duplicated header logic; a 401 mid-session relies solely on the 30 s JWT poll. | `src/service/calls.ts` |
| S7 | Medium | `onError` returns `error.response` including for non-HTTP/network errors, so callers must defensively check `res.status`; a network failure yields a plain message object and sagas may mis-handle it. | `calls.ts:22-36` |
| S8 | Medium | Logout API call is fire-and-forget; if it fails, the server-side refresh token may remain valid until expiry (client storage is still cleared). | `Header.tsx:99-105` |
| S9 | Low | Two parallel error-message systems (`errorMessage` numeric vs `apiErrorMessage` message/detail) can produce inconsistent UX. | `src/utils/error.tsx`, `src/utils/apiErrors.ts` |
| S10 | Low | Trailing-slash inconsistency (`INACTIVE_USERS_URL`, `NOTIFICATIONS_URL`). `withQuery` strips it, so likely harmless but fragile. | `src/constant/api.ts:82,175` |
| S11 | Low | `.env.development` has `REACT_APP_USE_MOCKS=true` — requires care so a production build never inherits mocks. Production env is blank, which is correct. | `.env.development:17` |
| S12 | Low | Analytics module is dead code; harmless at runtime but risks confusion and untested code paths. | `src/store/analytics`, `src/service/analytics` |
| S13 | Low | `doDeleteCard` `force` query-param name is unconfirmed (code comment FE-06). | `src/service/resources/index.js:63` |
| S14 | Info | No secrets are committed; `.env.production` is intentionally empty. Do **not** print env values in reports. | env files |

Reliability gaps:
- Loading/error states are handled per-slice (STATUS.Loading/Success/Error) consistently for existing slices.
- **No tests** exist for `calls.ts`, auth sagas, token refresh, or any endpoint — high regression risk for the wiring work.
- The 30 s JWT poll plus manual refresh is the only expiry safety net; a request made in the gap can 401.

---

## 7. Exact files that may require changes

| File | Why |
|---|---|
| `src/store/sagas.js` | Fork `analyticsSaga` (wiring analytics/insights). |
| `src/store/reducers.js` | Add `analytics: analyticsReducer`. |
| `src/store/actions.js` | Re-export `./analytics/actions` (or import directly in pages). |
| `src/route/Routes.tsx` | Register analytics/insights (and later menu/recon/integrations) routes. |
| `src/route/types.ts` | Route constants already exist; no change unless renamed. |
| `src/service/*` | Add service functions for §4 missing endpoints. |
| `src/constant/api.ts` | Only if `/api/v1/` prefix or path corrections are confirmed. |
| `src/service/calls.ts` | If moving to a shared axios instance + interceptors. |
| `src/utils/fetchPDF.ts` | Align headers with shared client; add user error feedback. |
| `src/page/Login/pages/LoginPage.tsx` | **Remove password logging (S1).** |
| `src/page/Profile/pages/ProfilePage.tsx` | **Remove password logging (S2).** |
| `src/firebase/firebase.js` | Remove/guard FCM token log (S3). |
| `src/page/Login/pages/ForgetPasswordPage.tsx` | Remove email/raw logging (S4). |
| `src/components/Base/Header.tsx`, `src/App.tsx` | Route logout through saga; await/ignore safely. |
| Pages + new sagas | Wire newly added service areas (analytics first). |
| `src/utils/error.tsx` / `src/utils/apiErrors.ts` | Optionally unify error-message handling. |

---

## 8. Prioritized recommendations

1. **P0 — Remove credential logging** in `LoginPage.tsx:72`, `ProfilePage.tsx:69`; also `ForgetPasswordPage.tsx:75` and FCM token log. (Small, high-impact.)
2. **P0 — Obtain `API_COMPLETE_REFERENCE.md`** or a written endpoint matrix from the backend team. Nothing about paths/verbs/bodies/response shapes can be certified without it.
3. **P1 — Decide analytics wiring:** either wire it (3-line change) or delete it. Do not leave dead code.
4. **P1 — Confirm the `/api/v1/` prefix** question with the backend. Changing it affects every request (`api.ts`).
5. **P1 — Fix `fetchPDF`**: correct headers + surface errors to the user.
6. **P2 — Introduce a shared axios instance + interceptor** for base URL, Bearer token, 401→refresh→retry, and centralized error handling. This addresses S6/S7/S9 in one place.
7. **P2 — Move logout through the saga** and await (or deliberately fire-and-forget with a comment) the API call.
8. **P2 — Confirm `force` param name** for `doDeleteCard` and trailing-slash policy.
9. **P3 — Add tests** for `calls.ts`, token refresh, login, and each newly wired slice.
10. **P3 — Build the remaining features** (menu, top-up, parent controls, integrations, reconciliation, refund, reset-strikes) only once tickets/contracts exist.

---

## 9. Items requiring backend developer / supervisor confirmation

1. **The missing contract file** — can it be supplied? This blocks most verification.
2. Is there an **`/api/v1/` prefix** or not?
3. **Correct HTTP verb** for every list/read endpoint (the code mixes POST and GET).
4. **Exact request bodies** and **response shapes** for all endpoints (login `refresh`/`user`, error `code` vs `message`/`detail`, pagination envelope `{count,next,previous,results}`).
5. **`force` parameter name** for delete-card and whether it is a query param or body field.
6. **Trailing-slash policy** (`/resources/notifications/`, `/resources/inactive-users-list/`).
7. **Error contract:** numeric codes vs `message`/`detail`; which fields are final (BE-02/BE-12).
8. **Operator access to `/list/canteen-items`** (documented 403) — is a scoped endpoint coming?
9. **Analytics/Insights freshness:** are BE-42/43/45 merged and stable enough to wire now, or still mock-only?
10. Whether the unused endpoints in §4 are **intentionally deferred** or expected now.

---

## 10. Suggested testing plan

| Layer | Test | Why |
|---|---|---|
| Unit | `calls.ts` `withQuery` (trailing slash, arrays, empty values) and `onError` (403 throttle, network error) | Core request building. |
| Unit | `sessionToken.ts` (already exists) + `clearAllClientStorage` | Token storage safety. |
| Unit | `apiErrors` / `errorMessage` mapping | Consistent messages. |
| Unit | `fetchPDF` (headers, blob, error path) | S5. |
| Saga | `loginTask` success/failure, `tokenTask` rotation & failure clears storage, analytics saga `takeLatest` wiring | Regression risk. |
| Integration | Boot with refresh token → `/auth/token/refresh` → protected route renders | FE-03 flow. |
| Integration | After wiring analytics: dispatch `ANALYTICS_SALES_REQUEST` → service called → reducer updated | Proves §4 wiring. |
| Manual | Login/logout, 401 expiry, 403 toast, PDF report, card delete with/without `force` | End-to-end. |
| Contract | For every endpoint in §3, assert the URL/verb against `API_COMPLETE_REFERENCE.md` once provided | Closes the unconfirmed gaps. |

**Commands (from `package.json`):** `npm test` (CRA/Jest), `npm run build` (catches TS/lint breaks). There is **no** dedicated lint/typecheck script; `react-scripts` runs ESLint during build.

---

# TASK 7 — Safe implementation plan (NOT implemented)

Small, independently verifiable phases. Each phase should end with `npm test` + `npm run build`.

### Phase 0 — Verification & guardrails (no behavior change)
- Obtain `API_COMPLETE_REFERENCE.md`; confirm prefix, verbs, bodies, error contract (§9).
- Files: none (documentation/confirmation only).

### Phase 1 — Security cleanup (small, high value)
- `src/page/Login/pages/LoginPage.tsx` — delete `console.log(data)` (S1).
- `src/page/Profile/pages/ProfilePage.tsx` — delete `console.log(data)` (S2).
- `src/page/Login/pages/ForgetPasswordPage.tsx` — delete `console.log(data)` (S4).
- `src/firebase/firebase.js` — remove/guard FCM token log (S3).
- Verify: `npm run build`.

### Phase 2 — Wire Analytics/Insights (finish existing work)
- `src/store/sagas.js` — import + `fork(analyticsSaga)`.
- `src/store/reducers.js` — add `analytics: analyticsReducer`.
- `src/store/actions.js` — re-export `./analytics/actions`.
- Add analytics/insights pages + register in `src/route/Routes.tsx` (admin guard).
- Verify: unit test the saga; manual smoke with `REACT_APP_USE_MOCKS=true`.

### Phase 3 — HTTP client consolidation (careful, cross-cutting)
- `src/service/calls.ts` — introduce a shared axios instance + interceptor (base URL, Bearer, 401→refresh→retry, centralized errors), keeping helper signatures stable.
- `src/utils/fetchPDF.ts` — use the shared client; fix headers; surface errors.
- Verify: unit tests for interceptors + full manual pass. **Highest regression risk — do after Phase 2.**

### Phase 4 — Auth flow correctness
- Route logout through the saga (`Header.tsx`, `App.tsx`) and handle failure.
- Unify error mapping (`error.tsx` / `apiErrors.ts`).
- Verify: saga tests + manual expiry test.

### Phase 5 — Missing feature slices (only with confirmed contracts)
- Add service functions for menu, top-up, parent controls, integrations, reconciliation, refund, reset-strikes; add sagas/reducers/actions/routes as each ticket lands.
- Verify per feature with mocks then live.

---

## What was actually inspected

- Config: `package.json`, `.env.example`, `.env.development`, `.env.production`, `src/constant/api.ts`, `src/constant/index.ts`, `src/constant/actionTypes.ts` (diff), `src/route/types.ts`, `src/route/Routes.tsx`.
- HTTP/utils: `src/service/calls.ts`, `src/utils/fetchPDF.ts`, `src/utils/error.tsx`, `src/utils/apiErrors.ts`, `src/utils/sessionToken.ts`, `src/utils/index.ts`, `src/mocks/index.ts`.
- Services: auth, dashboard, resources, sessions, user, lookups, ledger, analytics (all 8 modules).
- Store: `index.js`, `sagas.js`, `reducers.js`, `actions.js`, `auth/{sagas,reducers}.js`, `analytics/sagas.js`.
- App/UI: `src/App.tsx`, `src/components/Base/Header.tsx` (logout + logs), `LoginPage.tsx`, `ForgetPasswordPage.tsx`, `ProfilePage.tsx`.
- Tests present: `src/utils/sessionToken.test.ts`, `src/utils/formatMoney.test.ts`, `src/mocks/ledger.test.ts`.
- Existing documentation: all of `docs/api-audit/`.
- Git status/diff and greps for `api/v1`, `console.*`, analytics usage, logout call sites.

## What could not be verified

- **Everything contract-dependent**, because `API_COMPLETE_REFERENCE.md` does not exist: exact paths, HTTP verbs, request bodies, response fields, error contract, `/api/v1/` prefix, `force` param name, trailing-slash policy.
- Backend permission matrix for each endpoint (only code comments note admin-only `/list/*` and the operator 403).
- Whether analytics/insights endpoints are live or mock-only on the backend.
- Whether the unused §4 endpoints are intentionally deferred.
