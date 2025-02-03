import { AMBASSADOR } from "../../../constant";

export function transactionListRequest(token) {
    return {
        type: AMBASSADOR.TRANSACTION_HISTORY_REQUEST,
        payload: {
            token
        }
    }
}

export function transactionListReset() {
    return {
        type: AMBASSADOR.TRANSACTION_HISTORY_RESET
    }
}

// transfer fund from current amount to security
export function tranferFundRequest(token, amount) {
    return {
        type: AMBASSADOR.TRANSFER_FUND_REQUEST,
        payload: {
            token,
            amount
        }
    }
}

export function transferFundReset() {
    return{
        type: AMBASSADOR.TRANSFER_FUND_RESET,
    }
}

// withdraw profit amount
export function withdrawRequest(token, amount) {
    return {
        type: AMBASSADOR.WITHDRAW_REQUEST,
        payload: {
            token,
            amount
        }
    }
}

export function withdrawReset() {
    return{
        type: AMBASSADOR.WITHDRAW_RESET,
    }
}

export function verifyWithdrawRequest(token, request_id, OTP) {
    return {
        type: AMBASSADOR.VERIFY_WITHDRAW_REQUEST,
        payload: {
            token,
            request_id,
            OTP
        }
    }
}

export function verifyWithdrawReset() {
    return{
        type: AMBASSADOR.VERIFY_WITHDRAW_RESET,
    }
}