import { CREATE_SCHOOL, SCHOOL_LIST } from "../../constant";
import { listRequest, resourceRequest } from "../calls";

export function doCreateSchool(token, data){
    return resourceRequest(token, CREATE_SCHOOL, data)
}

export function doSchoolList(token, data, page){
    return listRequest(token, SCHOOL_LIST, data, page)
}