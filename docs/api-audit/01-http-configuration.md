# 1. How HTTP is configured

## Client

- The single central helper file is **`src/service/calls.ts`**. It uses `axios`.
- There is **no shared axios instance and no interceptor**. Every helper function builds its
  own request object.
- Error handling: `onError` **returns `error.response`** instead of re-throwing, so callers
  read `res.status` directly. A `403` shows one throttled toast
  (`errors.notAllowed`, 3s cooldown); session-ending `401` handling is left to the auth saga.

## Base URL

- Defined in **`src/constant/api.ts:32`** as `API_BASE`, read from the build-time env var
  **`REACT_APP_API_BASE_URL`**.
  - `.env.development` → `http://127.0.0.1:8000`
  - `.env.production` → intentionally blank; must be set per deployment and logs a loud
    warning if missing.
  - Dev-only fallback is `http://127.0.0.1:8000`; production has **no** baked-in fallback.
- `FILE_BASE` is the same value as `API_BASE`.
- **No `/api/v1/` prefix is used anywhere.** Endpoints are flat, e.g. `/auth/login`,
  `/dashboard/counts`, `/resources/card-list`.

## Bearer token handling

- There is no interceptor. The access token is passed as a `token` argument into each helper,
  which sets `Authorization: Bearer <token>` manually:
  - `src/service/calls.ts:84, 99, 117, 137, 151`
  - `src/utils/fetchPDF.ts:11`
- `guestRequest` sends no token (login, logout, refresh, forgot/reset password).

## Helper functions (`src/service/calls.ts`)

| Helper | Verb | Auth | Notes |
|---|---|---|---|
| `guestRequest` | POST | no | JSON body |
| `resourceRequest` | POST | yes | JSON body |
| `listRequest` | POST | yes | appends `?page=` |
| `getRequest` | GET | yes | query params via `withQuery` |
| `getListRequest` | GET | yes | `getRequest` + `page` |
| `putRequest` | PUT | yes | JSON body |
| `multipartRequest` | POST | yes | file / form-data, 60s timeout |
| `withQuery` | – | – | builds query strings without double slashes |

## Login / refresh / logout

- **Login:** `src/service/auth` `doLogin` → `POST /auth/login`, handled by `loginTask` in
  `src/store/auth/sagas.js` (expects `res.data.refresh` and `res.data.user`).
- **Token refresh:** `doRefreshToken` → `POST /auth/token/refresh`, handled by `tokenTask`.
  The new refresh token is only stored if the response actually returns one.
- **Token storage:**
  - Access token lives in memory (redux). The `auth` slice is **not** persisted.
  - Refresh token lives in **sessionStorage** (`src/utils/sessionToken.ts`).
  - Only non-sensitive user display fields are cached in localStorage.
  - This is a deliberate security decision (labelled FE-03 in the code).
- **Logout:** `POST /auth/logout` is called **directly** from `src/components/Base/Header.tsx:103`
  and `src/App.tsx:111` (not through the saga). The saga's `logoutTask` only clears client
  storage.
