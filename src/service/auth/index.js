import { LOGOUT_URL, LOGIN_URL, REFRESH_URL, CREATE_USER_URL, EDIT_USER_URL, ACTIVATE_USER_URL, FORGOT_PASSWORD_URL, CHANGE_PASSWORD_URL, IMPORT_UPLOAD_URL, IMPORT_COMMIT_URL, RESET_PASSWORD_CONFIRM_URL } from '../../constant';
import {guestRequest, multipartRequest, resourceRequest} from '../calls'

// create user
export function doCreateUser(token, data){
    return multipartRequest(token, CREATE_USER_URL, data)
}

// edit user
export function doEditUser(token, data){
    return multipartRequest(token, EDIT_USER_URL, data)
}

// activate/ deactivate user
export function doActivateUser(token, data){
    return resourceRequest(token, ACTIVATE_USER_URL, data);
}

// login call
export function doLogin (data) {
    return guestRequest(LOGIN_URL, data)
}

// logout call
export function doLogout (data) {
    return guestRequest(LOGOUT_URL, data)
}

// refreshtoken call
export function doRefreshToken(data){
    return guestRequest(REFRESH_URL, data)
}

// forgot password
export function doForgotPassword(data){
    return guestRequest(FORGOT_PASSWORD_URL, data)
}

// change password
export function doChangePassword(token, data){
    return resourceRequest(token, CHANGE_PASSWORD_URL, data)
}

// import students preview (multipart: file, dry_run, mode)
export function doImportPreview(token, data){
    return multipartRequest(token, IMPORT_UPLOAD_URL, data)
}

// import students commit (multipart: file, mode)
export function doImportCommit(token, data){
    return multipartRequest(token, IMPORT_COMMIT_URL, data)
}

// confirm a password reset using the token from the emailed link
export function doConfirmPasswordReset(data){
    return guestRequest(RESET_PASSWORD_CONFIRM_URL, data)
}