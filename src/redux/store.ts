import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import nhanvienSlice from "./nhanvienSlice";
import settingsSlice from "./settingsSlice";
import nghiphepSlice from "./nghiphepSlice";
import companySlice from "./companySlice";
import luongSlice from "./luongSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
const persistConfig = {
  key: "root",
  version: 1,
  storage,
};
const rootReducer = combineReducers({
  settings: settingsSlice,
  auth: authSlice,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: {
    persistedReducer,
    nhanvien: nhanvienSlice,
    nghiphep: nghiphepSlice,
    company: companySlice,
    luong: luongSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: true,
});
export let persistor = persistStore(store);
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
