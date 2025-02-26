import { STUDENT_DETAILS_URL, USERS_LIST_URL, ADMIN_DETAILS_URL, OPERATOR_DETAILS_URL, PARENT_DETAILS_URL, INACTIVE_USERS_URL, STAFF_DETAILS_URL } from "../../constant";
import { listRequest, resourceRequest } from "../calls";

// user list call
export function doUserList(token, data, page){
    return listRequest(token, USERS_LIST_URL, data, page)
}

// inactive users call
export function doInactiveUsers(token, data, page){
    return listRequest(token, INACTIVE_USERS_URL, data, page)
}

// student details
export function doStudentDetails(token, data){
    return resourceRequest(token, STUDENT_DETAILS_URL, data)
}

// admin details
export function doAdminDetails(token, data){
    return resourceRequest(token, ADMIN_DETAILS_URL, data)
}

// operation details
export function doOperatorDetails(token, data){
    return resourceRequest(token, OPERATOR_DETAILS_URL, data)
}

// parent details
export function doParentDetails(token, data){
    return resourceRequest(token, PARENT_DETAILS_URL, data)
}

// parent details
export function doStaffDetails(token, data){
    return resourceRequest(token, STAFF_DETAILS_URL, data)
}