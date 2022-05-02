import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootState } from "~/app/store";
import { alphabeticalSort, uniqueArray } from "../util/functions";
import { blankMonth, blankYear } from "./constants";
import { CrimeEntry, MonthData, MonthQuery, YearData, YearQuery } from "./types";

export const getCrimeCategories = createAsyncThunk("data/getCrimeCategories", () =>
  fetch("https://data.police.uk/api/crime-categories")
    .then((response) => response.json())
    .then(
      (value): Record<string, string> =>
        value.reduce((acc: Record<string, string>, { url, name }: { url: string; name: string }) => {
          acc[url] = name;
          return acc;
        }, {})
    )
);

const crimeAdapter = createEntityAdapter<CrimeEntry>({
  selectId: ({ persistent_id }) => persistent_id,
});

type DataState = {
  type: "month" | "year";
  initialLoad: boolean;
  crimes: EntityState<CrimeEntry>;
  query: MonthQuery | YearQuery | undefined;
  month: MonthData;
  year: YearData;
  formattedCategories: Record<string, string>;
};

const initialState: DataState = {
  type: "month",
  initialLoad: true,
  crimes: crimeAdapter.getInitialState(),
  query: undefined,
  month: blankMonth,
  year: blankYear,
  formattedCategories: {},
};

export const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setQuery: (state, { payload }: PayloadAction<MonthQuery | YearQuery>) => {
      state.query = payload;
    },
    setMonth: (state, { payload }: PayloadAction<MonthData>) => {
      state.type = "month";
      state.month = { ...state.month, ...payload };
      state.year = blankYear;
    },
    setYear: (state, { payload }: PayloadAction<YearData>) => {
      state.type = "year";
      state.year = { ...state.year, ...payload };
      state.month = blankMonth;
    },
    setCrimes: (state, { payload }: PayloadAction<CrimeEntry[]>) => {
      crimeAdapter.setAll(state.crimes, payload);
      state.initialLoad = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCrimeCategories.fulfilled, (state, { payload }) => {
      state.formattedCategories = payload;
    });
  },
});

export const { setQuery, setMonth, setYear, setCrimes } = dataSlice.actions;

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

export const selectQuery = (state: RootState) => state.data.query;

export const selectLocation = createSelector(selectAllCrimes, ([crimeEntry]) =>
  crimeEntry ? { lat: crimeEntry.location.latitude, lng: crimeEntry.location.longitude } : undefined
);

export const selectFormattedCategories = (state: RootState) => state.data.formattedCategories;

export const selectAllCategories = createSelector(
  selectAllCrimes,
  selectFormattedCategories,
  (allCrimes, formattedCategories) =>
    alphabeticalSort(uniqueArray(allCrimes.map(({ category }) => formattedCategories[category] ?? category)))
);

const months = [...Array(12)].map((_, i) => ++i);

const monthsZeroStart = months.map((month) => (month > 9 ? month.toString() : `0${month}`));

export const selectAllCrimesByMonth = createSelector(selectAllCrimes, selectQuery, (crimes, query) => {
  if (!query) {
    return {};
  }
  if (query.type === "month") {
    return { [query.month]: crimes };
  }
  const acc = monthsZeroStart.reduce<Record<string, CrimeEntry[]>>((midAcc, month) => {
    midAcc[`${query.year}-${month}`] = [];
    return midAcc;
  }, {});
  for (const crime of crimes) {
    acc[crime.month]?.push(crime);
  }
  return acc;
});

export const selectCountSeries = createSelector(selectQuery, selectAllCrimesByMonth, (query, allCrimes) => {
  if (!query) {
    return [];
  }
  switch (query.type) {
    case "month":
      return [allCrimes[query.month].length];
    case "year":
      return Object.values(allCrimes).map((crimes) => crimes.length);
    default:
      return [];
  }
});

export default dataSlice.reducer;
