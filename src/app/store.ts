import { configureStore } from "@reduxjs/toolkit";
import input from "@s/input";
import maps from "@s/maps";
import data from "@s/data";
import display from "@s/display";

export const store = configureStore({
  reducer: {
    input,
    maps,
    data,
    display,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
