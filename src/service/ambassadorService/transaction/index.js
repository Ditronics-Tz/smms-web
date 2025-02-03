import { TRANSACTION_HISTORY_URL, TRANSFER_FUND_URL, VERIFY_WITHDRAW_URL, WITHDRAW_URL} from "../../../constant"
import { resourceRequest } from "../../calls"

export function doFetchTransactionHistory(token) {
    const data = {}
    return resourceRequest(token, TRANSACTION_HISTORY_URL, data);
}

export function doTranferFund(token, amount) {
    const data = {
        'amount': amount
    };
    return resourceRequest(token, TRANSFER_FUND_URL, data);
}

export function doWithdraw(token, amount) {
    const data = {
        'amount': amount
    };
    return resourceRequest(token, WITHDRAW_URL, data);
}

export function doVerifyWithdraw(token, request_id, OTP) {
    const data = {
        'request_id': request_id,
        'OTP': OTP
    };
    return resourceRequest(token, VERIFY_WITHDRAW_URL, data);
}
