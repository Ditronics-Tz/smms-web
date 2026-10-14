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

        // strike management (admin)
        'RESET_STRIKES',

        // analytics (BE-42)
        'ANALYTICS_SALES',
        'ANALYTICS_WALLET_HEALTH',
        'ANALYTICS_OPERATORS',
        'ANALYTICS_CLASSES',
        'ANALYTICS_PENALTIES',

        // analytics export (BE-45)
        'ANALYTICS_EXPORT',

        // insights (BE-43)
        'INSIGHTS_FORECAST',
        'INSIGHTS_AT_RISK',
        'INSIGHTS_ANOMALIES',
        'INSIGHTS_RESOLVE_ANOMALY',
        'INSIGHTS_DORMANT',

        // daily menu (BE-80)
        'MENU_LIST',
        'MENU_UPDATE',

        // mobile money top-up (BE-60)
        'TOPUP_INITIATE',
        'TOPUP_STATUS',

        // parent controls (BE-90)
        'PARENT_LIMITS',
        'SET_PARENT_LIMIT',
        'PARENT_BLOCKS',
        'SET_PARENT_BLOCK',

        // integrations (BE-100)
        'API_KEYS',
        'CREATE_API_KEY',
        'REVOKE_API_KEY',
        'WEBHOOKS',
        'UPDATE_WEBHOOK',
        'SYNC_LOG',

        // reconciliation (BE-110)
        'RECON_UPLOAD',
        'RECON_RESOLVE',

        // refund (BE-121)
        'REFUND',

    ], suffixTypes);

export const ACTION_CHANGE_TO_ENGLISH = "CHANGE_TO_ENGLISH";
export const ACTION_CHANGE_TO_SWAHILI = "CHANGE_TO_SWAHILI";
export const ACTION_RESET_APP_STATE = "RESET_STATE";