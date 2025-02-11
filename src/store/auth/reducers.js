import { STATE, STATUS } from "../../constant";

const INITIAL_STATE = {
    accessToken: null,

    loginStatus: STATUS.DEFAULT,
    loginResult: null,
    loginErrorMessage: "",

    tokenStatus: STATUS.DEFAULT,
    tokenResult: null,
    tokenErrorMessage: "",

    createUserStatus: STATUS.DEFAULT,
    createUserResult: null,
    createUserErrorMessage: "",

    editUserStatus: STATUS.DEFAULT,
    editUserResult: null,
    editUserErrorMessage: "",

    activateUserStatus: STATUS.DEFAULT,
    activateUserResult: null,
    activateUserErrorMessage: "",
}

export default (state = INITIAL_STATE, { type, payload }) => {
    switch (type) {
        // LOGIN
        case STATE.LOGIN_LOADING:
            return {
                ...state,
                loginStatus: STATUS.LOADING
            }
        case STATE.LOGIN_SUCCESS:
            return {
                ...state,
                loginStatus: STATUS.SUCCESS,
                loginResult: payload,
                accessToken: payload.token,
                loginErrorMessage: ""
            }
        case STATE.LOGIN_FAILURE:
            return {
                ...state,
                loginStatus: STATUS.ERROR,
                loginResult: null,
                loginErrorMessage: payload,
                accessToken: null
            }
        case STATE.LOGIN_RESET:
            return {
                ...state,
                loginStatus: STATUS.DEFAULT,
                loginResult: null,
                accessToken: null,
                loginErrorMessage: ""
            }

        // token
        case STATE.TOKEN_LOADING:
            return {
                ...state,
                tokenStatus: STATUS.LOADING
            }
        case STATE.TOKEN_SUCCESS:
            return {
                ...state,
                tokenStatus: STATUS.SUCCESS,
                tokenResult: payload,
                accessToken: payload.access,
                tokenErrorMessage: ""
            }
        case STATE.TOKEN_FAILURE:
            return {
                ...state,
                tokenStatus: STATUS.ERROR,
                tokenResult: null,
                tokenErrorMessage: payload
            }
        case STATE.TOKEN_RESET:
            return {
                ...state,
                tokenStatus: STATUS.DEFAULT,
                tokenResult: null,
                tokenErrorMessage: ""
            }

        // CREATE USER
        case STATE.CREATE_USER_LOADING:
            return {
                ...state,
                createUserStatus: STATUS.LOADING
            }
        case STATE.CREATE_USER_SUCCESS:
            return {
                ...state,
                createUserStatus: STATUS.SUCCESS,
                createUserResult: payload,
                createUserErrorMessage: ""
            }
        case STATE.CREATE_USER_FAILURE:
            return {
                ...state,
                createUserStatus: STATUS.ERROR,
                createUserResult: null,
                createUserErrorMessage: payload,
            }
        case STATE.CREATE_USER_RESET:
            return {
                ...state,
                createUserStatus: STATUS.DEFAULT,
                createUserResult: null,
                createUserErrorMessage: ""
            }

        // EDIT USER
        case STATE.EDIT_USER_LOADING:
            return {
                ...state,
                editUserStatus: STATUS.LOADING
            }
        case STATE.EDIT_USER_SUCCESS:
            return {
                ...state,
                editUserStatus: STATUS.SUCCESS,
                editUserResult: payload,
                editUserErrorMessage: ""
            }
        case STATE.EDIT_USER_FAILURE:
            return {
                ...state,
                editUserStatus: STATUS.ERROR,
                editUserResult: null,
                editUserErrorMessage: payload,
            }
        case STATE.EDIT_USER_RESET:
            return {
                ...state,
                editUserStatus: STATUS.DEFAULT,
                editUserResult: null,
                editUserErrorMessage: ""
            }

        // ACTIVATE USER
        case STATE.ACTIVATE_USER_LOADING:
            return {
                ...state,
                activateUserStatus: STATUS.LOADING
            }
        case STATE.ACTIVATE_USER_SUCCESS:
            return {
                ...state,
                activateUserStatus: STATUS.SUCCESS,
                activateUserResult: payload,
                activateUserErrorMessage: ""
            }
        case STATE.ACTIVATE_USER_FAILURE:
            return {
                ...state,
                activateUserStatus: STATUS.ERROR,
                activateUserResult: null,
                activateUserErrorMessage: payload,
            }
        case STATE.ACTIVATE_USER_RESET:
            return {
                ...state,
                activateUserStatus: STATUS.DEFAULT,
                activateUserResult: null,
                activateUserErrorMessage: ""
            }
            

        default:
            return state;
    }
}