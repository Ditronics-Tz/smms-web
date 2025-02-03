import { combineReducers } from "redux";

import authReducer from "./ambassador/authAmb/reducers";
import resourceReducer from "./ambassador/resource/reducers";
import profileReducer from "./ambassador/profile/reducers";
import transactioReducer from "./ambassador/transaction/reducers";
import passwordReducer from "./ambassador/password/reducers";

import userTypeReducer from './userType/reducer'
import { ACTION_RESET_APP_STATE } from '../constant';

const appReducers = combineReducers({
    // ambassodor reducers
    authAmb: authReducer,
    resource: resourceReducer,
    profile: profileReducer,
    transaction: transactioReducer,
    password: passwordReducer,

    user: userTypeReducer
});

const rootReducer = (state, action) => {
    //added to prevent stacking on loading possibility
    if(action.type === ACTION_RESET_APP_STATE) {
        return appReducers(undefined, action);
    }
    return appReducers(state, action);
}

export default appReducers;