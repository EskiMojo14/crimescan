import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { MonthData, YearData } from "../../util/types";

const blankMonth: MonthData = {
  type: "month",
  location: "",
  query: {
    type: "month",
    month: "",
    lat: "",
    lng: "",
  },
  allCategories: [""],
  count: 0,
  categoryCount: [0],
};

const blankYear: YearData = {
  type: "year",
  location: "",
  query: {
    type: "year",
    year: "",
    lat: "",
    lng: "",
  },
  allCategories: [""],
  count: [0],
  categoryCount: [[0]],
};

type DataState = {
  type: "month" | "year";
  month: MonthData;
  year: YearData;
};

const initialState: DataState = {
  type: "month",
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
  },
});

export const { setMonth, setYear } = dataSlice.actions;

export const selectType = (state: RootState) => state.data.type;

export const selectMonthData = (state: RootState) => state.data.month;

export const selectYearData = (state: RootState) => state.data.year;

export const selectQuery = (state: RootState) =>
  state.data.type === "month" ? state.data.month.query : state.data.year.query;

export const selectLocation = (state: RootState) =>
  state.data.type === "month" ? state.data.month.location : state.data.year.location;

export default dataSlice.reducer;
