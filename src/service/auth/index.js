import { LOGOUT_URL, LOGIN_URL, REFRESH_URL, CREATE_USER_URL } from '../../constant';
import {guestRequest, multipartRequest, resourceRequest} from '../calls'

// create user
export function doCreateUser(token, data){
    return multipartRequest(token, CREATE_USER_URL, data)
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