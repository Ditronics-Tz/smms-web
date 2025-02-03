import { SUPPORT_CHAT_URL } from "../../../constant"
import { resourceRequest } from "../calls"

export default function doSendSupportChat(token, data) {
    return resourceRequest(token, SUPPORT_CHAT_URL, data);
}