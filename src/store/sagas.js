import { fork } from "@redux-saga/core/effects";

import authSaga from "./ambassador/authAmb/sagas";
import resourceSaga from "./ambassador/resource/sagas";
import profileSaga from "./ambassador/profile/sagas";
import transactionSaga from "./ambassador/transaction/sagas";
import passwordSaga from "./ambassador/password/sagas";


export default function* root() {
    yield fork(authSaga);
    yield fork(resourceSaga);
    yield fork(profileSaga);
    yield fork(transactionSaga);
    yield fork(passwordSaga);
}