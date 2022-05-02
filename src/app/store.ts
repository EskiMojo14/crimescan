import { configureStore } from "@reduxjs/toolkit";
import data from "@s/data";
import display from "@s/display";

export const store = configureStore({
  reducer: {
    data,
    display,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
