import { PASSWORD_CHANGE_URL } from "../../../constant";
import { resourceRequest } from "../../calls";

export function doPasswordChange(token, old_pass, new_pass, confirm_pass) {
    const data = {
        "old_pass": old_pass,
        "new_pass": new_pass,
        "confirm_pass": confirm_pass
    }
    return resourceRequest(token, PASSWORD_CHANGE_URL, data)
}