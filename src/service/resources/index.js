import { ACTIVATE_CARD_URL, ALL_NOTIFICATIONS_URL, CARD_DETAILS_URL, CARD_LIST_URL, CREATE_CARD_URL, CREATE_ITEM_URL, CREATE_SCHOOL_URL, DELETE_CARD_URL, DELETE_ITEM_URL, DELETE_SCHOOL_URL, EDIT_CARD_URL, EDIT_ITEM_URL, ITEM_LIST_URL, NOTIFICATIONS_URL, REPLACE_CARD_URL, SCHOOL_LIST_URL } from "../../constant";
import { listRequest, resourceRequest, withQuery } from "../calls";

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

// { old_card_id, new_card_number, reason, carry_balance }
export function doReplaceCard(token, data){
    return resourceRequest(token, REPLACE_CARD_URL, data)
}

// { card_id }. `force` is the documented second call for a card the backend
// refuses to delete because it has history: with force=true the card is
// deactivated instead. The exact param name is confirmed with Ahmed (FE-06).
export function doDeleteCard(token, data, force = false){
    return resourceRequest(token, withQuery(DELETE_CARD_URL, { force: force ? 'true' : undefined }), data)
}

export function doNotification(token, data){
    return resourceRequest(token, NOTIFICATIONS_URL, data)
}

export function doAllNotifications(token, data, page){
    return listRequest(token, ALL_NOTIFICATIONS_URL, data, page)
}