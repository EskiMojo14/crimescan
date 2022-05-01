import { configureStore } from "@reduxjs/toolkit";
import inputReducer from "./slices/input";
import mapsReducer from "./slices/maps";
import dataReducer from "./slices/data";
import displayReducer from "./slices/display";

export const store = configureStore({
  reducer: {
    input: inputReducer,
    maps: mapsReducer,
    data: dataReducer,
    display: displayReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
