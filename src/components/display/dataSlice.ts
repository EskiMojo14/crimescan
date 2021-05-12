import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { ProcessedData } from "../../util/types";

const initialState: ProcessedData = { location: "", queryLocation: "", count: 0 };

export const displaySlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setAll: (state, action: PayloadAction<ProcessedData>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setAll } = displaySlice.actions;

export const selectLocation = (state: RootState) => state.data.location;

export const selectQueryLocation = (state: RootState) => state.data.queryLocation;

export const selectCount = (state: RootState) => state.data.count;

export default displaySlice.reducer;
