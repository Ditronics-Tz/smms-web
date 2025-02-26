// ----- BASE API ------
export const API_BASE = 'http://127.0.0.1:8000';
// export const API_BASE = 'http://192.168.103.29:8000';


// FOR PRODUCTION
// export const API_BASE = 'https://backend1.ditronics.co.tz'
export const FILE_BASE =  API_BASE;

// ---- AUTH URLS ------
export const LOGIN_URL = "/auth/login";
export const LOGOUT_URL = "/auth/logout";
export const REFRESH_URL = "/auth/token/refresh";
export const CREATE_USER_URL = '/auth/create-user';
export const EDIT_USER_URL = '/auth/edit-user';
export const ACTIVATE_USER_URL = '/auth/activate-deactivate-user'

// ---- DASHBOARD URLS -----
export const COUNTS_URL = "/dashboard/counts";
export const SALES_SUMMARY_URL = "/dashboard/sales-summary";
export const SALES_TREND_URL = "/dashboard/sales-trend";
export const LAST_SESSION_URL = "/dashboard/last-session";
export const PARENT_STUDENTS_URL = "/dashboard/parent-students";
export const STAFF_VIEW_URL = "/dashboard/staff-view";


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

// ---- NOTIFICATIONS ----
export const NOTIFICATIONS_URL = '/resources/notifications/';
export const ALL_NOTIFICATIONS_URL = '/resources/all-notifications';
