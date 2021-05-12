import { configureStore } from "@reduxjs/toolkit";
import inputReducer from "../components/input/inputSlice";
import dataReducer from "../components/display/dataSlice";

export const store = configureStore({
  reducer: {
    input: inputReducer,
    data: dataReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
