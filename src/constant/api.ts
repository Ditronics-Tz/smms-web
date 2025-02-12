// ----- BASE API ------
// export const API_BASE = 'http://127.0.0.1:8000';

export const API_BASE = 'http://31.200.82.177:8000'
export const FILE_BASE =  API_BASE;

// ---- AUTH URLS ------
export const LOGIN_URL = "/auth/login";
export const LOGOUT_URL = "/auth/logout";
export const REFRESH_URL = "/auth/token/refresh";
export const CREATE_USER_URL = '/auth/create-user';
export const EDIT_USER_URL = '/auth/edit-user';
export const ACTIVATE_USER_URL = '/auth/activate-deactivate-user'


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


// ---- SESSION URLS -----
export const START_SESSION_URL = '';
export const END_SESSION_URL = '';
export const SESSION_LIST_URL = '';
export const SCANNED_LIST_URL = '';
export const SCAN_CARD_URL = '';