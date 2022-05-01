import { configureStore } from "@reduxjs/toolkit";
import input from "./slices/input";
import maps from "./slices/maps";
import data from "./slices/data";
import display from "./slices/display";

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
