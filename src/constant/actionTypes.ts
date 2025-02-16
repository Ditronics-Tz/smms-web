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
export const STATE = createRequestTypes('STATE',
    [
        // authentication
        'LOGIN',
        'TOKEN',

        'CREATE_USER',
        'EDIT_USER',
        'USER_LIST',
        'INACTIVE_USERS',
        'ACTIVATE_USER',


        // resources
        'CREATE_SCHOOL',
        'SCHOOL_LIST',
        'DELETE_SCHOOL',

        'CREATE_ITEM',
        'ITEM_LIST',
        'EDIT_ITEM',
        'DELETE_ITEM',

        'CREATE_CARD',
        'CARD_LIST',
        'EDIT_CARD',
        'ACTIVATE_CARD',
        'CARD_DETAILS',


        // users
        'STUDENT_DETAILS',
        'ADMIN_DETAILS',
        'OPERATOR_DETAILS',
        'PARENT_DETAILS',

        // session
        'START_SESSION',
        'END_SESSION',
        'SCANNED_LIST',
        'SESSION_LIST',
        'SCAN_CARD',
        'TRANSACTIONS',

        // notifications
        'NOTIFICATIONS',
        'ALL_NOTIFICATIONS',


    ], suffixTypes);

export const ACTION_CHANGE_TO_ENGLISH = "CHANGE_TO_ENGLISH";
export const ACTION_CHANGE_TO_SWAHILI = "CHANGE_TO_SWAHILI";
export const ACTION_RESET_APP_STATE = "RESET_STATE";