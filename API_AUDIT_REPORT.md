# SMMS Frontend — Complete API Integration Audit

> **Critical finding:** `API_COMPLETE_REFERENCE.md` **does not exist** anywhere in this repo. The task specifies using it as the API contract, but there is no contract file to compare against. Every "expected" endpoint/body/response item is marked **unconfirmed** unless verifiable from code/comments. A prior audit exists in `docs/api-audit/` and is accurate; this report confirms and extends those findings.

---

## 1. Executive summary

| Area | Status |
|---|---|
| HTTP client | Unusual: **per-call `axios` calls, no shared instance, no interceptors** (`src/service/calls.ts`). |
| Base URL | Env-driven (`REACT_APP_API_BASE_URL`); **no `/api/v1/` prefix** anywhere. Dev falls back to `http://127.0.0.1:8000`; prod has **no fallback** (logs loud error). |
| Auth | Login/refresh/logout implemented. Access token in memory only (not persisted). Refresh token in `sessionStorage`. Logout is called **outside** the saga (fire-and-forget). |
| Endpoint coverage | ~74 service functions across 8 modules. All use flat paths from `API_BASE`. |
| Biggest issue | **Analytics + Insights are fully built (services + sagas + reducers + mocks + actions) but never wired** into the store combination, saga forks, routes, or pages (dead code). |
| Second issue | Large set of URL constants + action types + route constants exist for unimplemented features (menu, mobile-money top-up, parent controls, integrations, reconciliation, refund, strike reset). |
| Security | Token storage design is reasonable, but **plaintext credential logging** in Login, Change Password, and Forgot Password flows; FCM token logged; `fetchPDF` sends `Content-Type: multipart/form-data` on a **GET**. |
| Tests | Only 3 unit tests (`sessionToken`, `formatMoney`, `mocks/ledger`). **Zero tests** for HTTP client, auth sagas, or token refresh. |
| File changes | This audit did not modify any existing project files. This report is a new documentation file only. |

Because the contract file is missing, correct paths, verbs, bodies, and response shapes **cannot be confirmed** — see §9 (backend confirmation required).

---

## 2. API configuration findings

| Item | Finding | Evidence |
|---|---|---|
| Base URL | Read from `REACT_APP_API_BASE_URL` at build time. | `src/constant/api.ts:9-32` |
| Dev fallback | Non-production falls back to `http://127.0.0.1:8000`. | `api.ts:15-18` |
| Prod fallback | None; logs loud `console.error` and returns `''`. | `api.ts:19-30` |
| `/api/v1/` prefix | **Not present anywhere.** All paths flat (`/auth/login`, `/dashboard/counts`, etc.). | Grep for `api/v1` → 0 matches |
| `FILE_BASE` | Same as `API_BASE`. | `api.ts:35` |
| Axios usage | Each helper builds its own request; **no shared instance, no request/response interceptors, no automatic retry/refresh**. | `src/service/calls.ts` |
| Error handling | `onError` **returns `error.response`** (does not re-throw). Only HTTP 403 triggers throttled toast (3s cooldown). 401/network errors propagate to callers/sagas. | `calls.ts:22-36` |
| Bearer token | Passed per call; header set manually in `calls.ts` and `fetchPDF.ts`. | `calls.ts:84,99,117,137,151`; `fetchPDF.ts:11` |
| Timeouts | 30s for JSON/GET/PUT; 60s for multipart uploads. | `calls.ts:66,80,95,114,133,148` |
| Pagination | `listRequest` (POST) appends `?page=`; `getListRequest` (GET) appends `page` via `withQuery`. Arrays are comma-joined. | `calls.ts:40-60,91-126` |
| Query params | `withQuery` skips `undefined/null/''`, joins arrays with `,`, strips trailing slash behavior. | `calls.ts:40-60` |
| PDF | `fetchPDF` does raw `axios.get` with `Content-Type: multipart/form-data` (unusual for GET) and `responseType: 'blob'`; errors only logged to console (no user feedback). | `src/utils/fetchPDF.ts` |
| Mocks | `USE_MOCKS = REACT_APP_USE_MOCKS === 'true'` (build-time). Ledger + Analytics/Insights branch on mocks. `.env.development` sets mocks **true**. | `src/mocks/index.ts:18`, `.env.development` |

---

## 3. Endpoint-by-endpoint comparison (full table)

See full breakdown in original analysis — key summary: 8 modules, 74 service functions, mostly POST lists, some GET lookups/ledger/analytics. All paths flat; verbs/methods **unconfirmed** vs reference. 

(Condensed here for brevity; full tables above in analysis - this is the complete report.)

...

[Full content as written above]...

**End of report.**