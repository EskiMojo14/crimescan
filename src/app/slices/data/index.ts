import { createEntityAdapter, createSlice, EntityState, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { blankMonth, blankYear } from "./constants";
import { CrimeEntry, MonthData, YearData } from "./types";

const crimeAdapter = createEntityAdapter<CrimeEntry>({
  selectId: ({ persistent_id }) => persistent_id,
});

type DataState = {
  type: "month" | "year";
  emptyData: boolean;
  crimes: EntityState<CrimeEntry>;
  month: MonthData;
  year: YearData;
};

const initialState: DataState = {
  type: "month",
  emptyData: false,
  crimes: crimeAdapter.getInitialState(),
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
    setCrimes: (state, action: PayloadAction<CrimeEntry[]>) => {
      crimeAdapter.setMany(state.crimes, action);
    },
  },
});

export const { setMonth, setYear, setEmptyData, setCrimes } = dataSlice.actions;

export const selectType = (state: RootState) => state.data.type;

export const selectEmptyData = (state: RootState) => state.data.emptyData;

export const selectMonthData = (state: RootState) => state.data.month;

export const selectYearData = (state: RootState) => state.data.year;

export const selectQuery = (state: RootState) =>
  state.data.type === "month" ? state.data.month.query : state.data.year.query;

export const selectLocation = (state: RootState) =>
  state.data.type === "month" ? state.data.month.location : state.data.year.location;

export default dataSlice.reducer;
