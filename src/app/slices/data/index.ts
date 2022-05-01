import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { blankMonth, blankYear } from "./constants";
import { MonthData, YearData } from "./types";

type DataState = {
  type: "month" | "year";
  emptyData: boolean;
  month: MonthData;
  year: YearData;
};

const initialState: DataState = {
  type: "month",
  emptyData: false,
  month: blankMonth,
  year: blankYear,
};

export const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setMonth: (state, action: PayloadAction<MonthData>) => {
      state.type = "month";
      state.month = { ...state.month, ...action.payload };
      state.year = blankYear;
    },
    setYear: (state, action: PayloadAction<YearData>) => {
      state.type = "year";
      state.year = { ...state.year, ...action.payload };
      state.month = blankMonth;
    },
    setEmptyData: (state, action: PayloadAction<boolean>) => {
      state.emptyData = action.payload;
    },
  },
});

export const { setMonth, setYear, setEmptyData } = dataSlice.actions;

export const selectType = (state: RootState) => state.data.type;

export const selectEmptyData = (state: RootState) => state.data.emptyData;

export const selectMonthData = (state: RootState) => state.data.month;

export const selectYearData = (state: RootState) => state.data.year;

export const selectQuery = (state: RootState) =>
  state.data.type === "month" ? state.data.month.query : state.data.year.query;

export const selectLocation = (state: RootState) =>
  state.data.type === "month" ? state.data.month.location : state.data.year.location;

export default dataSlice.reducer;
