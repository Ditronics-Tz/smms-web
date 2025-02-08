// ----- BASE API ------
export const API_BASE = 'http://127.0.0.1:8000';
export const FILE_BASE =  API_BASE;

// ---- AUTH URLS ----
export const LOGIN_URL = "/auth/login";
export const LOGOUT_URL = "/auth/logout";
export const REFRESH_URL = "/auth/token/refresh";
export const CREATE_USER_URL = '/auth/create-user';
export const EDIT_USER_URL = '/auth/edit-user';

// ---- SCHOOL URL --- 
export const CREATE_SCHOOL = "/resources/create-school";
export const SCHOOL_LIST = "/resources/school-list";

// ---- USER URLS ----
export const USERS_LIST_URL = '/resources/users-list';
export const STUDENT_DETAILS_URL = '/resources/student-details';
export const ADMIN_DETAILS_URL = '';
export const PARENT_DETAILS_URL = '/resources/parent-details';
export const OPERATOR_DETAILS_URL = '/resources/operator-details';