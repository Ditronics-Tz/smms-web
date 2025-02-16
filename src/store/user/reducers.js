import { STATE, STATUS } from "../../constant";

const INITIAL_STATE = {


    userListStatus: STATUS.DEFAULT,
    userListResult: null,
    userListErrorMessage: "",

    inactiveUsersStatus: STATUS.DEFAULT,
    inactiveUsersResult: null,
    inactiveUsersErrorMessage: "",

    studentDetailsStatus: STATUS.DEFAULT,
    studentDetailsResult: null,
    studentDetailsErrorMessage: "",

    adminDetailsStatus: STATUS.DEFAULT,
    adminDetailsResult: null,
    adminDetailsErrorMessage: "",

    operatorDetailsStatus: STATUS.DEFAULT,
    operatorDetailsResult: null,
    operatorDetailsErrorMessage: "",

    parentDetailsStatus: STATUS.DEFAULT,
    parentDetailsResult: null,
    parentDetailsErrorMessage: "",
}

/* eslint-disable */
export default (state = INITIAL_STATE, { type, payload }) => {
    switch (type) {
        /* _________ 
        USER REDUCES 
        ____________ */

        // USER LIST
        case STATE.USER_LIST_LOADING:
            return {
                ...state,
                userListStatus: STATUS.LOADING
            }
        case STATE.USER_LIST_SUCCESS:
            return {
                ...state,
                userListStatus: STATUS.SUCCESS,
                userListResult: payload,
                userListErrorMessage: ""
            }
        case STATE.USER_LIST_FAILURE:
            return {
                ...state,
                userListStatus: STATUS.ERROR,
                userListResult: null,
                userListErrorMessage: payload,
            }
        case STATE.USER_LIST_RESET:
            return {
                ...state,
                userListStatus: STATUS.DEFAULT,
                userListResult: null,
                userListErrorMessage: ""
            }

             //INACTIVE_USERS
        case STATE.INACTIVE_USERS_LOADING:
            return {
                ...state,
                inactiveUsersStatus: STATUS.LOADING
            }
        case STATE.INACTIVE_USERS_SUCCESS:
            return {
                ...state,
                inactiveUsersStatus: STATUS.SUCCESS,
                inactiveUsersResult: payload,
                inactiveUsersErrorMessage: ""
            }
        case STATE.INACTIVE_USERS_FAILURE:
            return {
                ...state,
                inactiveUsersStatus: STATUS.ERROR,
                inactiveUsersResult: null,
                inactiveUsersErrorMessage: payload,
            }
        case STATE.INACTIVE_USERS_RESET:
            return {
                ...state,
                inactiveUsersStatus: STATUS.DEFAULT,
                inactiveUsersResult: null,
                inactiveUsersErrorMessage: ""
            }

        // STUDENT DETAILS
        case STATE.STUDENT_DETAILS_LOADING:
            return {
                ...state,
                studentDetailsStatus: STATUS.LOADING
            }
        case STATE.STUDENT_DETAILS_SUCCESS:
            return {
                ...state,
                studentDetailsStatus: STATUS.SUCCESS,
                studentDetailsResult: payload,
                studentDetailsErrorMessage: ""
            }
        case STATE.STUDENT_DETAILS_FAILURE:
            return {
                ...state,
                studentDetailsStatus: STATUS.ERROR,
                studentDetailsResult: null,
                studentDetailsErrorMessage: payload,
            }
        case STATE.STUDENT_DETAILS_RESET:
            return {
                ...state,
                studentDetailsStatus: STATUS.DEFAULT,
                studentDetailsResult: null,
                studentDetailsErrorMessage: ""
            }

        
            
        // ADMIN DETAILS
        case STATE.ADMIN_DETAILS_LOADING:
            return {
                ...state,
                adminDetailsStatus: STATUS.LOADING
            }
        case STATE.ADMIN_DETAILS_SUCCESS:
            return {
                ...state,
                adminDetailsStatus: STATUS.SUCCESS,
                adminDetailsResult: payload,
                adminDetailsErrorMessage: ""
            }
        case STATE.ADMIN_DETAILS_FAILURE:
            return {
                ...state,
                adminDetailsStatus: STATUS.ERROR,
                adminDetailsResult: null,
                adminDetailsErrorMessage: payload,
            }
        case STATE.ADMIN_DETAILS_RESET:
            return {
                ...state,
                adminDetailsStatus: STATUS.DEFAULT,
                adminDetailsResult: null,
                adminDetailsErrorMessage: ""
            }

            // OPERATOR DETAILS
        case STATE.OPERATOR_DETAILS_LOADING:
            return {
                ...state,
                operatorDetailsStatus: STATUS.LOADING
            }
        case STATE.OPERATOR_DETAILS_SUCCESS:
            return {
                ...state,
                operatorDetailsStatus: STATUS.SUCCESS,
                operatorDetailsResult: payload,
                operatorDetailsErrorMessage: ""
            }
        case STATE.OPERATOR_DETAILS_FAILURE:
            return {
                ...state,
                operatorDetailsStatus: STATUS.ERROR,
                operatorDetailsResult: null,
                operatorDetailsErrorMessage: payload,
            }
        case STATE.OPERATOR_DETAILS_RESET:
            return {
                ...state,
                operatorDetailsStatus: STATUS.DEFAULT,
                operatorDetailsResult: null,
                operatorDetailsErrorMessage: ""
            }

            // PARENT DETAILS
        case STATE.PARENT_DETAILS_LOADING:
            return {
                ...state,
                parentDetailsStatus: STATUS.LOADING
            }
        case STATE.PARENT_DETAILS_SUCCESS:
            return {
                ...state,
                parentDetailsStatus: STATUS.SUCCESS,
                parentDetailsResult: payload,
                parentDetailsErrorMessage: ""
            }
        case STATE.PARENT_DETAILS_FAILURE:
            return {
                ...state,
                parentDetailsStatus: STATUS.ERROR,
                parentDetailsResult: null,
                parentDetailsErrorMessage: payload,
            }
        case STATE.PARENT_DETAILS_RESET:
            return {
                ...state,
                parentDetailsStatus: STATUS.DEFAULT,
                parentDetailsResult: null,
                parentDetailsErrorMessage: ""
            }

        default:
            return state;
    }
}