import { STATE, STATUS } from "../../constant";

const INITIAL_STATE = {
    createSchoolStatus: STATUS.DEFAULT,
    createSchoolResult: null,
    createSchoolErrorMessage: "",

    schoolListStatus: STATUS.DEFAULT,
    schoolListResult: null,
    schoolListErrorMessage: "",

    deleteSchoolStatus: STATUS.DEFAULT,
    deleteSchoolResult: null,
    deleteSchoolErrorMessage: "",

    createItemStatus: STATUS.DEFAULT,
    createItemResult: null,
    createItemErrorMessage: "",

    editItemStatus: STATUS.DEFAULT,
    editItemResult: null,
    editItemErrorMessage: "",

    deleteItemStatus: STATUS.DEFAULT,
    deleteItemResult: null,
    deleteItemErrorMessage: "",

    itemListStatus: STATUS.DEFAULT,
    itemListResult: null,
    itemListErrorMessage: "",

    createCardStatus: STATUS.DEFAULT,
    createCardResult: null,
    createCardErrorMessage: "",

    editCardStatus: STATUS.DEFAULT,
    editCardResult: null,
    editCardErrorMessage: "",

    deleteCardStatus: STATUS.DEFAULT,
    deleteCardResult: null,
    deleteCardErrorMessage: "",

    activateCardStatus: STATUS.DEFAULT,
    activateCardResult: null,
    activateCardErrorMessage: "",

    cardListStatus: STATUS.DEFAULT,
    cardListResult: null,
    cardListErrorMessage: "",

    cardDetailsStatus: STATUS.DEFAULT,
    cardDetailsResult: null,
    cardDetailsErrorMessage: "",
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
        
            // DELETE SCHOOL
        case STATE.DELETE_SCHOOL_LOADING:
            return {
                ...state,
                deleteSchoolStatus: STATUS.LOADING
            }
        case STATE.DELETE_SCHOOL_SUCCESS:
            return {
                ...state,
                deleteSchoolStatus: STATUS.SUCCESS,
                deleteSchoolResult: payload,
                deleteSchoolErrorMessage: ""
            }
        case STATE.DELETE_SCHOOL_FAILURE:
            return {
                ...state,
                deleteSchoolStatus: STATUS.ERROR,
                deleteSchoolResult: null,
                deleteSchoolErrorMessage: payload,
            }
        case STATE.DELETE_SCHOOL_RESET:
            return {
                ...state,
                deleteSchoolStatus: STATUS.DEFAULT,
                deleteSchoolResult: null,
                deleteSchoolErrorMessage: ""
            }

        // CREATE ITEM
        case STATE.CREATE_ITEM_LOADING:
            return {
                ...state,
                createItemStatus: STATUS.LOADING
            }
        case STATE.CREATE_ITEM_SUCCESS:
            return {
                ...state,
                createItemStatus: STATUS.SUCCESS,
                createItemResult: payload,
                createItemErrorMessage: ""
            }
        case STATE.CREATE_ITEM_FAILURE:
            return {
                ...state,
                createItemStatus: STATUS.ERROR,
                createItemResult: null,
                createItemErrorMessage: payload,
            }
        case STATE.CREATE_ITEM_RESET:
            return {
                ...state,
                createItemStatus: STATUS.DEFAULT,
                createItemResult: null,
                createItemErrorMessage: ""
            }

        // EDIT ITEM
        case STATE.EDIT_ITEM_LOADING:
            return {
                ...state,
                editItemStatus: STATUS.LOADING
            }
        case STATE.EDIT_ITEM_SUCCESS:
            return {
                ...state,
                editItemStatus: STATUS.SUCCESS,
                editItemResult: payload,
                editItemErrorMessage: ""
            }
        case STATE.EDIT_ITEM_FAILURE:
            return {
                ...state,
                editItemStatus: STATUS.ERROR,
                editItemResult: null,
                editItemErrorMessage: payload,
            }
        case STATE.EDIT_ITEM_RESET:
            return {
                ...state,
                editItemStatus: STATUS.DEFAULT,
                editItemResult: null,
                editItemErrorMessage: ""
            }
        
        // ITEM LIST
        case STATE.ITEM_LIST_LOADING:
            return {
                ...state,
                itemListStatus: STATUS.LOADING
            }
        case STATE.ITEM_LIST_SUCCESS:
            return {
                ...state,
                itemListStatus: STATUS.SUCCESS,
                itemListResult: payload,
                itemListErrorMessage: ""
            }
        case STATE.ITEM_LIST_FAILURE:
            return {
                ...state,
                itemListStatus: STATUS.ERROR,
                itemListResult: null,
                itemListErrorMessage: payload,
            }
        case STATE.ITEM_LIST_RESET:
            return {
                ...state,
                itemListStatus: STATUS.DEFAULT,
                itemListResult: null,
                itemListErrorMessage: ""
            }


            // DELETE ITEM
        case STATE.DELETE_ITEM_LOADING:
            return {
                ...state,
                deleteItemStatus: STATUS.LOADING
            }
        case STATE.DELETE_ITEM_SUCCESS:
            return {
                ...state,
                deleteItemStatus: STATUS.SUCCESS,
                deleteItemResult: payload,
                deleteItemErrorMessage: ""
            }
        case STATE.DELETE_ITEM_FAILURE:
            return {
                ...state,
                deleteItemStatus: STATUS.ERROR,
                deleteItemResult: null,
                deleteItemErrorMessage: payload,
            }
        case STATE.DELETE_ITEM_RESET:
            return {
                ...state,
                deleteItemStatus: STATUS.DEFAULT,
                deleteItemResult: null,
                deleteItemErrorMessage: ""
            }


        // CREATE CARD
        case STATE.CREATE_CARD_LOADING:
            return {
                ...state,
                createCardStatus: STATUS.LOADING
            }
        case STATE.CREATE_CARD_SUCCESS:
            return {
                ...state,
                createCardStatus: STATUS.SUCCESS,
                createCardResult: payload,
                createCardErrorMessage: ""
            }
        case STATE.CREATE_CARD_FAILURE:
            return {
                ...state,
                createCardStatus: STATUS.ERROR,
                createCardResult: null,
                createCardErrorMessage: payload,
            }
        case STATE.CREATE_CARD_RESET:
            return {
                ...state,
                createCardStatus: STATUS.DEFAULT,
                createCardResult: null,
                createCardErrorMessage: ""
            }

        // EDIT CARD
        case STATE.EDIT_CARD_LOADING:
            return {
                ...state,
                editCardStatus: STATUS.LOADING
            }
        case STATE.EDIT_CARD_SUCCESS:
            return {
                ...state,
                editCardStatus: STATUS.SUCCESS,
                editCardResult: payload,
                editCardErrorMessage: ""
            }
        case STATE.EDIT_CARD_FAILURE:
            return {
                ...state,
                editCardStatus: STATUS.ERROR,
                editCardResult: null,
                editCardErrorMessage: payload,
            }
        case STATE.EDIT_CARD_RESET:
            return {
                ...state,
                editCardStatus: STATUS.DEFAULT,
                editCardResult: null,
                editCardErrorMessage: ""
            }

         
        // ACTIVATE CARD
        case STATE.ACTIVATE_CARD_LOADING:
            return {
                ...state,
                activateCardStatus: STATUS.LOADING
            }
        case STATE.ACTIVATE_CARD_SUCCESS:
            return {
                ...state,
                activateCardStatus: STATUS.SUCCESS,
                activateCardResult: payload,
                activateCardErrorMessage: ""
            }
        case STATE.ACTIVATE_CARD_FAILURE:
            return {
                ...state,
                activateCardStatus: STATUS.ERROR,
                activateCardResult: null,
                activateCardErrorMessage: payload,
            }
        case STATE.ACTIVATE_CARD_RESET:
            return {
                ...state,
                activateCardStatus: STATUS.DEFAULT,
                activateCardResult: null,
                activateCardErrorMessage: ""
            }
            
            
        // CARD LIST
        case STATE.CARD_LIST_LOADING:
            return {
                ...state,
                cardListStatus: STATUS.LOADING
            }
        case STATE.CARD_LIST_SUCCESS:
            return {
                ...state,
                cardListStatus: STATUS.SUCCESS,
                cardListResult: payload,
                cardListErrorMessage: ""
            }
        case STATE.CARD_LIST_FAILURE:
            return {
                ...state,
                cardListStatus: STATUS.ERROR,
                cardListResult: null,
                cardListErrorMessage: payload,
            }
        case STATE.CARD_LIST_RESET:
            return {
                ...state,
                cardListStatus: STATUS.DEFAULT,
                cardListResult: null,
                cardListErrorMessage: ""
            }


             // CARD DETAILS
        case STATE.CARD_DETAILS_LOADING:
            return {
                ...state,
                cardDetailsStatus: STATUS.LOADING
            }
        case STATE.CARD_DETAILS_SUCCESS:
            return {
                ...state,
                cardDetailsStatus: STATUS.SUCCESS,
                cardDetailsResult: payload,
                cardDetailsErrorMessage: ""
            }
        case STATE.CARD_DETAILS_FAILURE:
            return {
                ...state,
                cardDetailsStatus: STATUS.ERROR,
                cardDetailsResult: null,
                cardDetailsErrorMessage: payload,
            }
        case STATE.CARD_DETAILS_RESET:
            return {
                ...state,
                cardDetailsStatus: STATUS.DEFAULT,
                cardDetailsResult: null,
                cardDetailsErrorMessage: ""
            }

        default:
            return state;
    }
}