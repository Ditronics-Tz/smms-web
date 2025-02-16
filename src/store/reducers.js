import { combineReducers } from "redux";

import authReducer from "./auth/reducers";
import userReducer from "./user/reducers";
import resourcesReducer from "./resources/reducers"
import sessionReducer from "./session/reducers"

const appReducers = combineReducers({
    auth: authReducer,
    user: userReducer,
    resources: resourcesReducer,
    session: sessionReducer
});

export default appReducers;