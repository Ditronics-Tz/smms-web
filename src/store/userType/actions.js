import { USERTYPE_RESET, USERTYPE_SET } from "./constants"

export const setUserType = (userType) => {
    return {
        type: USERTYPE_SET,
        payload: userType
    }
}

export const resetUserType = () => {
    return {
        type: USERTYPE_RESET
    }
}

