import { STUDENT_DETAILS_URL, STUDENT_EDIT_URL, STUDENT_LIST_URL, CREATE_USER_URL } from "../../constant";
import { listRequest, resourceRequest } from "../calls";

// student list call
export function doStudentList(token, data, page){
    return listRequest(token, STUDENT_LIST_URL, data, page)
}

// student details
export function doStudentDetails(token, data){
    return resourceRequest(token, STUDENT_DETAILS_URL, data)
}

// student edit
export function doStudentEdit(token, data){
    return resourceRequest(token, STUDENT_EDIT_URL, data)
}