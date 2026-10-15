# 2. Existing integrations

Endpoints that already have service code. All URLs come from `src/constant/api.ts`.

## Auth — `src/service/auth/index.js`

| Function | Endpoint |
|---|---|
| `doCreateUser` | `POST /auth/create-user` (multipart) |
| `doEditUser` | `POST /auth/edit-user` (multipart) |
| `doActivateUser` | `POST /auth/activate-deactivate-user` |
| `doLogin` | `POST /auth/login` |
| `doLogout` | `POST /auth/logout` |
| `doRefreshToken` | `POST /auth/token/refresh` |
| `doForgotPassword` | `POST /auth/forgot-password` |
| `doConfirmPasswordReset` | `POST /auth/reset-password/confirm` |
| `doChangePassword` | `POST /auth/change-password` |
| `doImportPreview` | `POST /imports/upload` (multipart) |
| `doImportCommit` | `POST /imports/commit` (multipart) |

## Dashboard — `src/service/dashboard/index.js`

| Function | Endpoint |
|---|---|
| `doCounts` | `/dashboard/counts` |
| `doSalesSummary` | `/dashboard/sales-summary` |
| `doSalesTrend` | `/dashboard/sales-trend` |
| `doLastSession` | `/dashboard/last-session` |
| `doParentStudents` | `/dashboard/parent-students` |
| `doStaffView` | `/dashboard/staff-view` |
| `doChildSpend` | `/dashboard/children-spend` |
| `doBalanceThreshold` | `GET /dashboard/balance-threshold` |
| `doSetBalanceThreshold` | `PUT /dashboard/balance-threshold` |

## Resources — `src/service/resources/index.js`

| Function | Endpoint |
|---|---|
| `doCreateSchool` | `/resources/create-school` |
| `doSchoolList` | `/resources/school-list` |
| `doDeleteSchool` | `/resources/delete-school` |
| `doCreateItem` | `/resources/create-item` |
| `doItemList` | `/resources/item-list` |
| `doEditItem` | `/resources/edit-item` |
| `doDeleteItem` | `/resources/delete-item` |
| `doCreateCard` | `/resources/create-card` |
| `doCardList` | `/resources/card-list` |
| `doEditCard` | `/resources/edit-card` |
| `doCardDetails` | `/resources/card-details` |
| `doActivateCard` | `/resources/activate-deactivate-card` |
| `doReplaceCard` | `/resources/replace-card` |
| `doDeleteCard` | `/resources/delete-card?force=` |
| `doNotification` | `/resources/notifications/` |
| `doAllNotifications` | `/resources/all-notifications` |

## Sessions / Wallet — `src/service/sessions/index.js`

| Function | Endpoint |
|---|---|
| `doScanCard` | `POST /sessions/scan-card` |
| `doStartSession` | `POST /sessions/start-session` |
| `doEndSession` | `POST /sessions/end-session` |
| `doSessionList` | `POST /sessions/session-list` |
| `doScannedList` | `POST /sessions/scanned-data` |
| `doTransactions` | `POST /sessions/transaction-list` |
| `doReverseTransaction` | `POST /wallet/transaction/reverse` |
| `doDepositRequest` | `POST /wallet/deposit/create` |
| `doDepositList` | `GET /wallet/deposit/list` |

## User — `src/service/user/index.js`

| Function | Endpoint |
|---|---|
| `doUserList` | `/resources/users-list` |
| `doInactiveUsers` | `/resources/inactive-users-list/` |
| `doStudentDetails` | `/resources/student-details` |
| `doAdminDetails` | `/resources/admin-details` |
| `doParentDetails` | `/resources/parent-details` |
| `doOperatorDetails` | `/resources/operator-details` |
| `doStaffDetails` | `/resources/staff-details` |

## Lookups — `src/service/lookups/index.js`

| Function | Endpoint |
|---|---|
| `doListStudents` | `GET /list/students` |
| `doListStaffs` | `GET /list/staffs` |
| `doListSchools` | `GET /list/schools` |
| `doListParents` | `GET /list/parents` |
| `doListCanteenItems` | `GET /list/canteen-items` |
| `doActiveSession` | `GET /sessions/active-session` |

## Ledger — `src/service/ledger/index.js` (read-only, mock-backed)

| Function | Endpoint |
|---|---|
| `getJournal` | `GET /ledger/journal` |
| `getJournalEntry` | `GET /ledger/journal/{entry_id}` |
| `getCardStatement` | `GET /ledger/cards/{card_id}/statement` |
| `getAccountStatement` | `GET /ledger/accounts/{code}/statement` |
| `getTrialBalance` | `GET /ledger/trial-balance` |
| `getIntegrity` | `GET /ledger/integrity` |

## Analytics / Insights — `src/service/analytics/index.js` (mock-backed, NOT WIRED)

| Function | Endpoint |
|---|---|
| `getSales` | `GET /analytics/sales` |
| `getWalletHealth` | `GET /analytics/wallet-health` |
| `getOperators` | `GET /analytics/operators` |
| `getClasses` | `GET /analytics/classes` |
| `getPenalties` | `GET /analytics/penalties` |
| `exportAnalytics` | `GET /analytics/export` |
| `getForecast` | `GET /insights/forecast` |
| `getAtRisk` | `GET /insights/at-risk` |
| `getAnomalies` | `GET /insights/anomalies` |
| `resolveAnomaly` | `POST /insights/anomalies/{id}/resolve` |
| `getDormantCards` | `GET /insights/dormant-cards` |

See [`04-findings.md`](./04-findings.md) for why the analytics family does not actually run.
