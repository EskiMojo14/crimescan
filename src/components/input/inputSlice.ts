import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

type InputState = {
  dateMode: "month" | "year";
  month: string;
  year: string;
  lat: string;
  lng: string;
};

export const initialState: InputState = {
  dateMode: "month",
  month: "",
  year: "",
  lat: "",
  lng: "",
};

export const inputSlice = createSlice({
  name: "input",
  initialState,
  reducers: {
    inputSet: <T extends keyof InputState>(
      state: InputState,
      action: PayloadAction<{ key: T; value: InputState[T] }>
    ) => {
      const { key, value } = action.payload;
      state[key] = value;
    },
  },
});

export const { inputSet } = inputSlice.actions;

export const selectDateMode = (state: RootState) => state.input.dateMode;

export const selectMonth = (state: RootState) => state.input.month;

export const selectYear = (state: RootState) => state.input.year;

export const selectLat = (state: RootState) => state.input.lat;

export const selectLng = (state: RootState) => state.input.lng;

export default inputSlice.reducer;
