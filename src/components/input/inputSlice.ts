import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { hasKey } from "../../util/functions";
import { RootState } from "../../app/store";

type InputState = {
  month: string;
  lat: string;
  lng: string;
};

const initialState: InputState = {
  month: "",
  lat: "",
  lng: "",
};

export const inputSlice = createSlice({
  name: "input",
  initialState,
  reducers: {
    inputSet: (state, action: PayloadAction<{ key: string; value: string }>) => {
      const { key, value } = action.payload;
      if (hasKey(state, key)) {
        state[key] = value;
      }
    },
  },
});

export const { inputSet } = inputSlice.actions;

export const selectMonth = (state: RootState) => state.input.month;

export const selectLat = (state: RootState) => state.input.lat;

export const selectLng = (state: RootState) => state.input.lng;

export default inputSlice.reducer;
