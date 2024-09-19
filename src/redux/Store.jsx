import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import themeReducer from './ThemeSlice'
import storage from 'redux-persist/lib/storage';
import { persistReducer as persistReducerLib, persistStore } from 'redux-persist';

const rootReducer = combineReducers({
  user: userReducer,
  theme: themeReducer
});

const persistConfig = {
  key: 'root',
  storage,
  version: 1,
};

const persistedReducer = persistReducerLib(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
