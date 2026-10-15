# 3. Missing integrations

These URL constants are **defined in `src/constant/api.ts` but never imported by any service
file**, so nothing calls them today. Each is a candidate for a new service function.

| Constant | URL | Area |
|---|---|---|
| `RESET_STRIKES_URL` | `/resources/reset-strikes` | Card management |
| `TOPUP_INITIATE_URL` | `/payments/topup/initiate` | Mobile-money top-up |
| `TOPUP_STATUS_URL` | `/payments/topup` | Mobile-money top-up |
| `topupStatusUrl(id)` | `/payments/topup/{id}` | Mobile-money top-up |
| `MENU_URL` | `/menu` | Daily menu |
| `MENU_TODAY_URL` | `/menu/today` | Daily menu |
| `PARENT_LIMITS_URL` | `/dashboard/student-limits` | Parent controls |
| `PARENT_BLOCKS_URL` | `/dashboard/item-blocks` | Parent controls |
| `INTEGRATIONS_API_KEYS_URL` | `/integrations/api-keys` | Integrations |
| `INTEGRATIONS_WEBHOOKS_URL` | `/integrations/webhooks` | Integrations |
| `INTEGRATIONS_SYNC_LOG_URL` | `/integrations/sync-log` | Integrations |
| `RECONCILIATION_UPLOAD_URL` | `/reconciliation/upload` | Reconciliation |
| `RECONCILIATION_RESOLVE_URL` | `/reconciliation/resolve` | Reconciliation |
| `REFUND_URL` | `/wallet/transaction/refund` | Refund |

> Note: the ticket labels in the comments (`BE-60`, `BE-80`, `BE-90`, `BE-100`, `BE-110`,
> `BE-121`) suggest these were placeholders for future backend work.
