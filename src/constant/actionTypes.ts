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
        'LOGIN',
        'TOKEN',
        'CREATE_USER',
        'EDIT_USER',
        'USER_LIST',

        'CREATE_SCHOOL',
        'SCHOOL_LIST',


        'STUDENT_DETAILS',
        'ADMIN_DETAILS',
        'OPERATOR_DETAILS',
        'PARENT_DETAILS',
    ], suffixTypes);

export const ACTION_CHANGE_TO_ENGLISH = "CHANGE_TO_ENGLISH";
export const ACTION_CHANGE_TO_SWAHILI = "CHANGE_TO_SWAHILI";
export const ACTION_RESET_APP_STATE = "RESET_STATE";