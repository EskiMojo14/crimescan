import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { ProcessedData } from "../../util/types";

const initialState = {
  type: "month",
  location: "",
  query: {
    type: "month",
    month: "",
    lat: "",
    lng: "",
  },
  allCategories: [],
  count: 0,
  categoryCount: [],
} as ProcessedData;

export const dataSlice = createSlice({
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

export const { setAll, setKey } = dataSlice.actions;

export const selectLocation = (state: RootState) => state.data.location;

export const selectQuery = (state: RootState) => state.data.query;

export const selectCount = (state: RootState) => state.data.count;

export default dataSlice.reducer;
