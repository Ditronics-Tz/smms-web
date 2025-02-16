import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
  } from 'redux-persist'
import storage from "redux-persist/lib/storage";
import rootReducer from './reducers'
import rootSaga from './sagas'


//create storage
const persistConfig = {
    key: 'root',
    storage,
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