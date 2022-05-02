import { createEntityAdapter, createSlice, EntityState, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "~/app/store";
import { blankMonth, blankYear } from "./constants";
import { CrimeEntry, MonthData, YearData } from "./types";

const crimeAdapter = createEntityAdapter<CrimeEntry>({
  selectId: ({ persistent_id }) => persistent_id,
});

type DataState = {
  type: "month" | "year";
  initialLoad: boolean;
  crimes: EntityState<CrimeEntry>;
  month: MonthData;
  year: YearData;
};

const initialState: DataState = {
  type: "month",
  initialLoad: true,
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
    setCrimes: (state, action: PayloadAction<CrimeEntry[]>) => {
      crimeAdapter.setMany(state.crimes, action);
      state.initialLoad = false;
    },
  },
});

export const { setMonth, setYear, setCrimes } = dataSlice.actions;

export const {
  selectIds: selectCrimeIds,
  selectEntities: selectCrimeMap,
  selectAll: selectAllCrimes,
  selectTotal: selectCrimeTotal,
  selectById: selectCrimeById,
} = crimeAdapter.getSelectors((state: RootState) => state.data.crimes);

export const selectInitialLoad = (state: RootState) => state.data.initialLoad;

export const selectType = (state: RootState) => state.data.type;

export const selectMonthData = (state: RootState) => state.data.month;

export const selectYearData = (state: RootState) => state.data.year;

export const selectQuery = (state: RootState) =>
  state.data.type === "month" ? state.data.month.query : state.data.year.query;

export const selectLocation = (state: RootState) =>
  state.data.type === "month" ? state.data.month.location : state.data.year.location;

export default dataSlice.reducer;
