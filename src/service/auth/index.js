import { LOGOUT_URL, LOGIN_URL, REFRESH_URL, CREATE_USER_URL, EDIT_USER_URL, ACTIVATE_USER_URL, FORGOT_PASSWORD_URL, CHANGE_PASSWORD_URL } from '../../constant';
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