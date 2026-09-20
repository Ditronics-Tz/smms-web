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
export const CHANGE_PASSWORD_URL = '/auth/change-password';

// ---- DASHBOARD URLS -----
export const COUNTS_URL = "/dashboard/counts";
export const SALES_SUMMARY_URL = "/dashboard/sales-summary";
export const SALES_TREND_URL = "/dashboard/sales-trend";
export const LAST_SESSION_URL = "/dashboard/last-session";
export const PARENT_STUDENTS_URL = "/dashboard/parent-students";
export const STAFF_VIEW_URL = "/dashboard/staff-view";
export const CHILD_SPEND_URL = "/dashboard/child-spend";


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
export const IMPORT_PREVIEW_URL = '/students/import-preview';
export const IMPORT_COMMIT_URL = '/students/import-commit';

// ---- USER URLS ----
export const USERS_LIST_URL = '/resources/users-list';
export const INACTIVE_USERS_URL = '/auth/inactive-users-list';
export const STUDENT_DETAILS_URL = '/resources/student-details';
export const ADMIN_DETAILS_URL = '/resources/admin-details';
export const PARENT_DETAILS_URL = '/resources/parent-details';
export const OPERATOR_DETAILS_URL = '/resources/operator-details';
export const STAFF_DETAILS_URL = '/resources/staff-details';


// ---- SESSION URLS -----
export const START_SESSION_URL = '/sessions/start-session';
export const END_SESSION_URL = '/sessions/end-session';
export const SESSION_LIST_URL = '/sessions/session-list';
export const SCANNED_LIST_URL = '/sessions/scanned-data';
export const SCAN_CARD_URL = '/sessions/scan-card';
export const TRANSACTIONS_URL = '/sessions/transaction-list';
export const REVERSE_TRANSACTION_URL = '/sessions/reverse-transaction';
export const DEPOSIT_REQUEST_URL = '/sessions/deposit-request';
export const DEPOSIT_REQUESTS_URL = '/sessions/deposit-request-list';

// ---- NOTIFICATIONS ----
export const NOTIFICATIONS_URL = '/resources/notifications/';
export const ALL_NOTIFICATIONS_URL = '/resources/all-notifications';
