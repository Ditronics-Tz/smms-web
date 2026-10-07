import { combineReducers } from "redux";

import authReducer from "./auth/reducers";
import userReducer from "./user/reducers";
import resourcesReducer from "./resources/reducers";
import sessionReducer from "./session/reducers";
import dashboardReducer from "./dashboard/reducers";
import ledgerReducer from "./ledger/reducers";

const appReducers = combineReducers({
    auth: authReducer,
    dashboard: dashboardReducer,
    user: userReducer,
    resources: resourcesReducer,
    session: sessionReducer,
    // FE-10: read-only ledger slice. Left out of the persisted whitelist on
    // purpose (see store/ledger/reducers.js).
    ledger: ledgerReducer
});

export default appReducers;