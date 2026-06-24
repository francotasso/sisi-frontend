import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import wishlistReducer from './wishlistSlice'

const createNoopStorage = () => ({
  getItem() { return Promise.resolve(null) },
  setItem() { return Promise.resolve() },
  removeItem() { return Promise.resolve() },
})

const storage = typeof window !== 'undefined'
  ? require('redux-persist/lib/storage').default
  : createNoopStorage()

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['wishlist'],
}

const rootReducer = combineReducers({
  wishlist: wishlistReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch
