const REQUEST = 'REQUEST';
const LOADING = 'LOADING';
const SUCCESS = 'SUCCESS';
const FAILURE = 'FAILURE';
const RESET = 'RESET';

const suffixTypes = [REQUEST, LOADING, SUCCESS, FAILURE, RESET];

function createRequestTypes(prefix = '', bases, suffixes = suffixTypes) {
    const req = {};
    bases.forEach((base) => {
        suffixes.forEach((suffix) => {
            req[`${base}_${suffix}`] = `${prefix}_${base}_${suffix}`;
        });
    });
    return req;
}

//sava application expected api states
export const AMBASSADOR = createRequestTypes('AMBASSADOR',
    [
        // AMBASSADOR 
        'LOGIN',
        'AMBASSADOR_OTP',
        'PENDING_LOAN_LIST',
        'PROFILE_DETAILS',
        'CLIENT_LOAN_HISTORY',
        'APPROVE_LOAN',
        'REJECT_LOAN',
        'AMBASSADOR_LOAN',
        'TRANSACTION_HISTORY',
        'CHAT_SUPPORT',
        'LOAN_APPROVE_TOKEN',
        'PASSWORD_CHANGE',
        'TRANSFER_FUND',
        'PAYPLAN_LIST',
        'VERIFY_CLIENT',
        'PAYPLAN_ASSIGN',
        'WITHDRAW',
        'VERIFY_WITHDRAW',
        'UNDERWRITING'
    ], suffixTypes);

export const ACTION_ACCOUNT_SETUP = "ACCOUNT_SETUP";
export const ACTION_ACCOUNT_REMOVE = "ACCOUNT_REMOVE";
export const ACTION_CHANGE_TO_ENGLISH = "CHANGE_TO_ENGLISH";
export const ACTION_CHANGE_TO_SWAHILI = "CHANGE_TO_SWAHILI";
export const ACTION_UPDATE_PUSH_COUNT = "UPDATE_PUSH_COUNT";
export const ACTION_RESET_PUSH_COUNT = "RESET_PUSH_COUNT";
export const ACTION_RESET_APP_STATE = "RESET_STATE";