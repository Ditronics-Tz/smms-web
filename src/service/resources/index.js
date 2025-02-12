import { ACTIVATE_CARD_URL, CARD_DETAILS_URL, CARD_LIST_URL, CREATE_CARD_URL, CREATE_ITEM_URL, CREATE_SCHOOL, CREATE_SCHOOL_URL, DELETE_ITEM_URL, DELETE_SCHOOL_URL, EDIT_CARD_URL, EDIT_ITEM_URL, ITEM_LIST_URL, SCHOOL_LIST, SCHOOL_LIST_URL } from "../../constant";
import { listRequest, resourceRequest } from "../calls";

// ---- SCHOOL ----
export function doCreateSchool(token, data){
    return resourceRequest(token, CREATE_SCHOOL_URL, data)
}

export function doSchoolList(token, data, page){
    return listRequest(token, SCHOOL_LIST_URL, data, page)
}

export function doDeleteSchool(token, data){
    return resourceRequest(token, DELETE_SCHOOL_URL, data)
}

// ----- ITEM -----
export function doCreateItem(token, data){
    return resourceRequest(token, CREATE_ITEM_URL, data)
}

export function doItemList(token, data, page){
    return listRequest(token, ITEM_LIST_URL, data, page)
}

export function doEditItem(token, data){
    return resourceRequest(token, EDIT_ITEM_URL, data)
}

export function doDeleteItem(token, data){
    return resourceRequest(token, DELETE_ITEM_URL, data)
}

// ----- CARD ----
export function doCreateCard(token, data){
    return resourceRequest(token, CREATE_CARD_URL, data)
}

export function doCardList(token, data, page){
    return listRequest(token, CARD_LIST_URL, data, page)
}

export function doEditCard(token, data){
    return resourceRequest(token, EDIT_CARD_URL, data)
}

export function doCardDetails(token, data){
    return resourceRequest(token, CARD_DETAILS_URL, data)
}

export function doActivateCard(token, data){
    return resourceRequest(token, ACTIVATE_CARD_URL, data)
}