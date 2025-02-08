import { STATE, STATUS } from "../../constant";

const INITIAL_STATE = {
    createSchoolStatus: STATUS.DEFAULT,
    createSchoolResult: null,
    createSchoolErrorMessage: "",

    schoolListStatus: STATUS.DEFAULT,
    schoolListResult: null,
    schoolListErrorMessage: "",
}

export default (state = INITIAL_STATE, { type, payload }) => {
    switch (type) {
        // CREATE SCHOOL
        case STATE.CREATE_SCHOOL_LOADING:
            return {
                ...state,
                createSchoolStatus: STATUS.LOADING
            }
        case STATE.CREATE_SCHOOL_SUCCESS:
            return {
                ...state,
                createSchoolStatus: STATUS.SUCCESS,
                createSchoolResult: payload,
                createSchoolErrorMessage: ""
            }
        case STATE.CREATE_SCHOOL_FAILURE:
            return {
                ...state,
                createSchoolStatus: STATUS.ERROR,
                createSchoolResult: null,
                createSchoolErrorMessage: payload,
            }
        case STATE.CREATE_SCHOOL_RESET:
            return {
                ...state,
                createSchoolStatus: STATUS.DEFAULT,
                createSchoolResult: null,
                createSchoolErrorMessage: ""
            }

        // SCHOOL LIST
        case STATE.SCHOOL_LIST_LOADING:
            return {
                ...state,
                schoolListStatus: STATUS.LOADING
            }
        case STATE.SCHOOL_LIST_SUCCESS:
            return {
                ...state,
                schoolListStatus: STATUS.SUCCESS,
                schoolListResult: payload,
                schoolListErrorMessage: ""
            }
        case STATE.SCHOOL_LIST_FAILURE:
            return {
                ...state,
                schoolListStatus: STATUS.ERROR,
                schoolListResult: null,
                schoolListErrorMessage: payload,
            }
        case STATE.SCHOOL_LIST_RESET:
            return {
                ...state,
                schoolListStatus: STATUS.DEFAULT,
                schoolListResult: null,
                schoolListErrorMessage: ""
            }

        default:
            return state;
    }
}