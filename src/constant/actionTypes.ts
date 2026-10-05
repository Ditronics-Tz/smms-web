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

// application expected api states
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
        'FORGOT_PASSWORD',
        'CHANGE_PASSWORD',
        'RESET_PASSWORD_CONFIRM',

        // bulk import
        'IMPORT_PREVIEW',
        'IMPORT_COMMIT',

        // dashboard
        'COUNTS',
        'SALES_SUMMARY',
        'SALES_TREND',
        'LAST_SESSION',
        'PARENT_STUDENTS',
        'STAFF_VIEW',
        'CHILD_SPEND',
        'BALANCE_THRESHOLD',
        'SET_BALANCE_THRESHOLD',

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
        'REPLACE_CARD',
        'DELETE_CARD',


        // users
        'STUDENT_DETAILS',
        'ADMIN_DETAILS',
        'OPERATOR_DETAILS',
        'PARENT_DETAILS',
        'STAFF_DETAILS',

        // session
        'START_SESSION',
        'END_SESSION',
        'SCANNED_LIST',
        'SESSION_LIST',
        'SCAN_CARD',
        'TRANSACTIONS',
        'REVERSE_TRANSACTION',
        'DEPOSIT_REQUEST',
        'DEPOSIT_LIST',

        // notifications
        'NOTIFICATIONS',
        'ALL_NOTIFICATIONS',

        // ledger (read-only)
        'LEDGER_JOURNAL',
        'LEDGER_JOURNAL_ENTRY',
        'LEDGER_CARD_STATEMENT',
        'LEDGER_ACCOUNT_STATEMENT',
        'LEDGER_TRIAL_BALANCE',
        'LEDGER_INTEGRITY',


    ], suffixTypes);

export const ACTION_CHANGE_TO_ENGLISH = "CHANGE_TO_ENGLISH";
export const ACTION_CHANGE_TO_SWAHILI = "CHANGE_TO_SWAHILI";
export const ACTION_RESET_APP_STATE = "RESET_STATE";