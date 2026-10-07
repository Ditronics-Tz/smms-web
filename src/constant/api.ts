// ----- BASE API ------
// CRA embeds REACT_APP_* values at build time. The API base URL is always
// driven by the REACT_APP_API_BASE_URL environment variable:
//   development -> .env.development
//   production  -> .env.production
// The localhost value below is a DEV-ONLY fallback and MUST NEVER be reached
// in a production build. A missing REACT_APP_API_BASE_URL in production logs a
// loud warning instead of silently talking to the local backend.
const RAW_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function resolveApiBaseUrl(): string {
  if (RAW_API_BASE_URL) {
    return RAW_API_BASE_URL;
  }
  if (process.env.NODE_ENV !== 'production') {
    // DEV-ONLY FALLBACK — never used in production builds.
    return 'http://127.0.0.1:8000';
  }
  // Production has NO baked-in fallback: warn loudly, return empty, and let the
  // app surface a failure instead of silently pointing at the local backend.
  // eslint-disable-next-line no-console
  console.error(
    '[SMMS] REACT_APP_API_BASE_URL is NOT set. ' +
      'This production build has no backend API base URL. ' +
      'Set REACT_APP_API_BASE_URL in your production environment ' +
      '(e.g. .env.production) before deploying, otherwise the app will not ' +
      'reach the backend.'
  );
  return '';
}

export const API_BASE = resolveApiBaseUrl();

// FILE_BASE derives from the SAME environment-driven value (no separate config).
export const FILE_BASE = API_BASE;

// ---- AUTH URLS ------
export const LOGIN_URL = "/auth/login";
export const LOGOUT_URL = "/auth/logout";
export const REFRESH_URL = "/auth/token/refresh";
export const CREATE_USER_URL = '/auth/create-user';
export const EDIT_USER_URL = '/auth/edit-user';
export const ACTIVATE_USER_URL = '/auth/activate-deactivate-user';
export const FORGOT_PASSWORD_URL = '/auth/forgot-password';
export const RESET_PASSWORD_CONFIRM_URL = '/auth/reset-password/confirm';
export const CHANGE_PASSWORD_URL = '/auth/change-password';

// ---- DASHBOARD URLS -----
export const COUNTS_URL = "/dashboard/counts";
export const SALES_SUMMARY_URL = "/dashboard/sales-summary";
export const SALES_TREND_URL = "/dashboard/sales-trend";
export const LAST_SESSION_URL = "/dashboard/last-session";
export const PARENT_STUDENTS_URL = "/dashboard/parent-students";
export const STAFF_VIEW_URL = "/dashboard/staff-view";
export const CHILD_SPEND_URL = "/dashboard/children-spend";
export const BALANCE_THRESHOLD_URL = "/dashboard/balance-threshold";


// ---- RESOURCES URLS ----- 
export const CREATE_SCHOOL_URL = "/resources/create-school";
export const SCHOOL_LIST_URL = "/resources/school-list";
export const DELETE_SCHOOL_URL = "/resources/delete-school";

export const CREATE_ITEM_URL = '/resources/create-item';
export const ITEM_LIST_URL = '/resources/item-list';
export const EDIT_ITEM_URL = '/resources/edit-item';
export const DELETE_ITEM_URL = '/resources/delete-item';

export const CREATE_CARD_URL = '/resources/create-card';
export const CARD_LIST_URL = '/resources/card-list';
export const EDIT_CARD_URL = '/resources/edit-card';
export const CARD_DETAILS_URL = '/resources/card-details';
export const ACTIVATE_CARD_URL = '/resources/activate-deactivate-card';


// ---- IMPORT URLS ----
export const IMPORT_UPLOAD_URL = '/imports/upload';
export const IMPORT_COMMIT_URL = '/imports/commit';

// ---- USER URLS ----
export const USERS_LIST_URL = '/resources/users-list';
export const INACTIVE_USERS_URL = '/resources/inactive-users-list/';
export const STUDENT_DETAILS_URL = '/resources/student-details';
export const ADMIN_DETAILS_URL = '/resources/admin-details';
export const PARENT_DETAILS_URL = '/resources/parent-details';
export const OPERATOR_DETAILS_URL = '/resources/operator-details';
export const STAFF_DETAILS_URL = '/resources/staff-details';


// ---- SESSION / WALLET URLS -----
export const START_SESSION_URL = '/sessions/start-session';
export const END_SESSION_URL = '/sessions/end-session';
export const SESSION_LIST_URL = '/sessions/session-list';
export const ACTIVE_SESSION_URL = '/sessions/active-session';
export const SCANNED_LIST_URL = '/sessions/scanned-data';
export const SCAN_CARD_URL = '/sessions/scan-card';
export const TRANSACTIONS_URL = '/sessions/transaction-list';

export const REVERSE_TRANSACTION_URL = '/wallet/transaction/reverse';
export const DEPOSIT_REQUEST_URL = '/wallet/deposit/create';
export const DEPOSIT_REQUESTS_URL = '/wallet/deposit/list';

// ---- CARD MANAGEMENT (admin) ----
export const REPLACE_CARD_URL = '/resources/replace-card';
export const DELETE_CARD_URL = '/resources/delete-card';
export const RESET_STRIKES_URL = '/resources/reset-strikes';

// ---- MOBILE MONEY TOP-UP ----
export const TOPUP_INITIATE_URL = '/payments/topup/initiate';
export const TOPUP_STATUS_URL = '/payments/topup';

// ---- LOOKUP / REFERENCE LISTS ----
// NOTE (FE-08): BE-03 locks these to admin. Callers on non-admin pages will get
// 403 until Ahmed provides scoped equivalents. Kept in one place so swapping the
// URL is a one-line change.
export const LIST_STUDENTS_URL = '/list/students';
export const LIST_STAFFS_URL = '/list/staffs';
export const LIST_SCHOOLS_URL = '/list/schools';
export const LIST_PARENTS_URL = '/list/parents';
export const LIST_CANTEEN_ITEMS_URL = '/list/canteen-items';

// ---- LEDGER URLS (BE-28 trial balance / integrity, BE-29 journal + statements) ----
// The ledger is read-only in the UI: there is deliberately no create/update/delete
// URL here. Every endpoint is a GET. Cards and accounts are addressed with a path
// segment, so the three helpers below build those URLs in one place.
export const LEDGER_JOURNAL_URL = '/ledger/journal';
export const LEDGER_TRIAL_BALANCE_URL = '/ledger/trial-balance';
export const LEDGER_INTEGRITY_URL = '/ledger/integrity';

export const ledgerJournalEntryUrl = (entryId: string) => `/ledger/journal/${entryId}`;
export const ledgerCardStatementUrl = (cardId: string) => `/ledger/cards/${cardId}/statement`;
export const ledgerAccountStatementUrl = (code: string) => `/ledger/accounts/${code}/statement`;

// ---- NOTIFICATIONS ----
export const NOTIFICATIONS_URL = '/resources/notifications/';
export const ALL_NOTIFICATIONS_URL = '/resources/all-notifications';
