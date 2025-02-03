import { AMBASSADOR_OTP_URL, LOGIN_URL } from '../../../constant';
import {guestRequest} from '../../calls'

export function doUserLogin (username, password) {
    const data = {
        username,
        password,
        version: "1.1.9",
        push_device_token: ""
    }
    return guestRequest(LOGIN_URL, data)
}

export function doVerifyOTP(username, OTP){
    const data = {
        username,
        OTP,
        version: "1.1.9",
        push_device_token: ""
    }
    return guestRequest(AMBASSADOR_OTP_URL, data)
}