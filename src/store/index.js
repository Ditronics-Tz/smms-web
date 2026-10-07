import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import {
    persistStore, persistReducer,
    FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER,
  } from 'redux-persist'
import storage from "redux-persist/lib/storage";
import rootReducer from './reducers'
import rootSaga from './sagas'

//create storage
//
// FE-03: the auth slice is deliberately NOT persisted. It holds the JWT access
// token, and redux-persist's default storage is localStorage — meaning any XSS
// bug let an attacker read the session token out of localStorage. With auth
// blacklisted, nothing about the session is written to localStorage; the access
// token lives in memory only and the refresh token lives in sessionStorage (see
// src/utils/sessionToken.ts). On boot the app calls /auth/token/refresh before
// rendering protected routes.
//
// FE-10: the ledger slice is blacklisted too. A persisted ledger would show a
// stale balance after a reload and would grow localStorage with every statement
// ever viewed; the backend is the only authority for money.
const persistConfig = {
    key: 'root',
    storage,
    blacklist: ['auth', 'ledger'],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)
// create the saga middleware
const sagaMiddleware = createSagaMiddleware()

// mount saga and reducer to store
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
          },
    }).concat(sagaMiddleware),
    // applyMiddleware(sagaMiddleware)
})

// then run the saga
sagaMiddleware.run(rootSaga)

export const persistor =  persistStore(store);
