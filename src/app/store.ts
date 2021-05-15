import { configureStore } from "@reduxjs/toolkit";
import inputReducer from "../components/input/inputSlice";
import mapsReducer from "../components/input/mapsSlice";
import dataReducer from "../components/display/dataSlice";
import displayReducer from "../components/display/displaySlice";

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
