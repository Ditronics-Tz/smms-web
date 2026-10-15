# SMMS Frontend API Audit

Inspection of the existing `smms-web` frontend before integrating the APIs described in
`API_COMPLETE_REFERENCE.md`.

> Status: **inspection / documentation only.** No application source code was changed.

## Important: the reference file is missing

`API_COMPLETE_REFERENCE.md` **does not exist** anywhere in this repo (the whole project was
searched, not just `src`, and it is not a deleted/untracked git file). The code below was
therefore compared against **itself and its own comments**, not against that reference.
Anything that needs the reference to confirm is marked **unconfirmed**.

## Index

| File | What it covers |
|---|---|
| [`01-http-configuration.md`](./01-http-configuration.md) | Axios/HTTP client, base URL, Bearer token, login, token refresh |
| [`02-existing-integrations.md`](./02-existing-integrations.md) | Endpoints that already have service code |
| [`03-missing-integrations.md`](./03-missing-integrations.md) | Defined URLs with no service wiring |
| [`04-findings.md`](./04-findings.md) | Biggest finding + inconsistencies / concerns |
| [`05-files-to-change.md`](./05-files-to-change.md) | Files that will likely need edits |
| [`06-unconfirmed.md`](./06-unconfirmed.md) | Things that could not be verified from code |

## Quick summary

- **No `/api/v1/` prefix** anywhere; endpoints are flat and built from `API_BASE`
  (`src/constant/api.ts:32`).
- HTTP is done with **per-call axios** in `src/service/calls.ts`; **no shared instance or
  interceptor**; the Bearer token is passed in as an argument each time.
- **Analytics/Insights is built but not wired** — the saga is never forked and the reducer
  is never combined, so those endpoints never fire at runtime.
- Several endpoint constants are **defined but unused** (top-up, menu, parent limits/blocks,
  integrations, reconciliation, refund, reset-strikes).
