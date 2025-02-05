import { combineReducers } from "redux";

import authReducer from "./auth/reducers";
import userReducer from "./user/reducers";

import { ACTION_RESET_APP_STATE } from '../constant';

const appReducers = combineReducers({
    auth: authReducer,

    user: userReducer
});

const rootReducer = (state, action) => {
    //added to prevent stacking on loading possibility
    if(action.type === ACTION_RESET_APP_STATE) {
        return appReducers(undefined, action);
    }
    return appReducers(state, action);
}

export default appReducers;