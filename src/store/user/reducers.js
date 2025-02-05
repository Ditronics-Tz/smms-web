import { STATE, STATUS } from "../../constant";

const INITIAL_STATE = {


    studentListStatus: STATUS.DEFAULT,
    studentListResult: null,
    studentListErrorMessage: "",

    studentDetailsStatus: STATUS.DEFAULT,
    studentDetailsResult: null,
    studentDetailsErrorMessage: "",

    studentEditStatus: STATUS.DEFAULT,
    studentEditResult: null,
    studentEditErrorMessage: "",
}

export default (state = INITIAL_STATE, { type, payload }) => {
    switch (type) {
        /* _________ 
        STUDENT REDUCES 
        ____________ */

        // STUDENT LIST
        case STATE.STUDENT_LIST_LOADING:
            return {
                ...state,
                studentListStatus: STATUS.LOADING
            }
        case STATE.STUDENT_LIST_SUCCESS:
            return {
                ...state,
                studentListStatus: STATUS.SUCCESS,
                studentListResult: payload,
                studentListErrorMessage: ""
            }
        case STATE.STUDENT_LIST_FAILURE:
            return {
                ...state,
                studentListStatus: STATUS.ERROR,
                studentListResult: null,
                studentListErrorMessage: payload,
            }
        case STATE.STUDENT_LIST_RESET:
            return {
                ...state,
                studentListStatus: STATUS.DEFAULT,
                studentListResult: null,
                studentListErrorMessage: ""
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

            // STUDENT EDIT
        case STATE.STUDENT_EDIT_LOADING:
            return {
                ...state,
                studentEditStatus: STATUS.LOADING
            }
        case STATE.STUDENT_EDIT_SUCCESS:
            return {
                ...state,
                studentEditStatus: STATUS.SUCCESS,
                studentEditResult: payload,
                studentEditErrorMessage: ""
            }
        case STATE.STUDENT_EDIT_FAILURE:
            return {
                ...state,
                studentEditStatus: STATUS.ERROR,
                studentEditResult: null,
                studentEditErrorMessage: payload,
            }
        case STATE.STUDENT_EDIT_RESET:
            return {
                ...state,
                studentEditStatus: STATUS.DEFAULT,
                studentEditResult: null,
                studentEditErrorMessage: ""
            }


        default:
            return state;
    }
}