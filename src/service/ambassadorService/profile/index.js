import { PROFILE_DETAILS_URL } from "../../../constant";
import { resourceRequest } from "../../calls";


export function doFetchAmbassadorProfile(token) {
    const data = {};
    return resourceRequest(token, PROFILE_DETAILS_URL, data);
}