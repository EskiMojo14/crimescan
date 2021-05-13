import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { ProcessedData } from "../../util/types";

const initialState = { type: "month", location: "", queryLocation: "", count: 0 } as ProcessedData;

export const displaySlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setAll: (state, action: PayloadAction<ProcessedData>) => {
      return { ...action.payload };
    },
    setKey: <T extends keyof ProcessedData>(
      state: ProcessedData,
      action: PayloadAction<{ key: T; value: ProcessedData[T] }>
    ) => {
      const { key, value } = action.payload;
      state[key] = value;
    },
  },
});

export const { setAll, setKey } = displaySlice.actions;

export const selectLocation = (state: RootState) => state.data.location;

export const selectQueryLocation = (state: RootState) => state.data.queryLocation;

export const selectCount = (state: RootState) => state.data.count;

export default displaySlice.reducer;
