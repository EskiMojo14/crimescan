import { configureStore } from "@reduxjs/toolkit";
import data from "@s/data";
import settings from "@s/settings";

export const store = configureStore({
  reducer: {
    data,
    settings,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
