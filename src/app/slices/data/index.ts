import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
  isAnyOf,
  isFulfilled,
  isPending,
  isRejected,
} from "@reduxjs/toolkit";
import cloneDeep from "lodash.clonedeep";
import { RootState } from "/src/app/store";
import { alphabeticalSort, promiseAllSeries, uniqueArray } from "@s/util/functions";
import { CrimeEntry, Query } from "./types";

const months = [...Array(12)].map((_, i) => ++i);

const monthsZeroStart = months.map((month) => (month > 9 ? month.toString() : `0${month}`));

export const getCrimeCategories = createAsyncThunk("data/getCrimeCategories", async () => {
  const categories: { url: string; name: string }[] = await fetch("https://data.police.uk/api/crime-categories").then(
    (response) => response.json()
  );
  return categories.reduce((acc: Record<string, string>, { url, name }: { url: string; name: string }) => {
    acc[url] = name;
    return acc;
  }, {});
});

export const getMonthData = createAsyncThunk(
  "data/getMonthData",
  ({ date, lat, lng }: Query): Promise<CrimeEntry[]> =>
    fetch(`https://data.police.uk/api/crimes-at-location?date=${date}&lat=${lat}&lng=${lng}`).then((response) =>
      response.json()
    )
);

export const getYearData = createAsyncThunk(
  "data/getYearData",
  ({ date, lat, lng }: Query): Promise<CrimeEntry[][]> =>
    promiseAllSeries(
      monthsZeroStart.map(
        (month) => () =>
          fetch(`https://data.police.uk/api/crimes-at-location?date=${date}-${month}&lat=${lat}&lng=${lng}`).then(
            (response) => response.json()
          )
      ),
      100
    )
);

const crimeAdapter = createEntityAdapter<CrimeEntry>();

type DataState = {
  initialLoad: boolean;
  loadingId: string;
  crimes: EntityState<CrimeEntry>;
  query: Query | undefined;
  formattedCategories: Record<string, string>;
};

export const initialState: DataState = {
  initialLoad: true,
  loadingId: "",
  crimes: crimeAdapter.getInitialState(),
  query: undefined,
  formattedCategories: {},
};

export const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCrimeCategories.fulfilled, (state, { payload }) => {
        state.formattedCategories = payload;
      })
      .addCase(getMonthData.fulfilled, (state, { payload, meta: { arg } }) => {
        state.query = arg;
        crimeAdapter.setAll(state.crimes, payload);
        state.initialLoad = false;
      })
      .addCase(getYearData.fulfilled, (state, { payload, meta: { arg } }) => {
        state.query = arg;
        crimeAdapter.setAll(state.crimes, payload.flat());
        state.initialLoad = false;
      })
      .addMatcher(isPending(getMonthData, getYearData), (state, { meta: { requestId } }) => {
        state.loadingId = requestId;
      })
      .addMatcher(
        isAnyOf(isFulfilled(getMonthData, getYearData), isRejected(getMonthData, getYearData)),
        (state, { meta: { requestId } }) => {
          if (state.loadingId === requestId) {
            state.loadingId = "";
          }
        }
      );
  },
});

export default dataSlice.reducer;

export const {
  selectIds: selectCrimeIds,
  selectEntities: selectCrimeMap,
  selectAll: selectAllCrimes,
  selectTotal: selectCrimeTotal,
  selectById: selectCrimeById,
} = crimeAdapter.getSelectors((state: RootState) => state.data.crimes);

export const selectInitialLoad = (state: RootState) => state.data.initialLoad;

export const selectLoading = (state: RootState) => !!state.data.loadingId;

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

export const selectAllOutcomes = createSelector(selectAllCrimes, (allCrimes) => {
  const outcomes = new Set<string>();
  for (const crime of allCrimes) {
    if (crime.outcome_status) {
      outcomes.add(crime.outcome_status.category);
    }
  }
  return alphabeticalSort(Array.from(outcomes));
});

export const selectAllCrimesByMonth = createSelector(selectAllCrimes, selectQuery, (crimes, query) => {
  if (!query) {
    return {};
  }
  if (query.type === "month") {
    return { [query.date]: crimes };
  }
  const acc = monthsZeroStart.reduce<Record<string, CrimeEntry[]>>((midAcc, month) => {
    midAcc[`${query.date}-${month}`] = [];
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
      return [allCrimes[query.date].length];
    case "year":
      return Object.values(allCrimes).map((crimes) => crimes.length);
    default:
      return [];
  }
});

export const selectCategoryCount = createSelector(
  selectQuery,
  selectFormattedCategories,
  selectAllCategories,
  selectAllCrimesByMonth,
  (query, formattedCategories, allCategories, crimesByMonth) => {
    if (!query) {
      return [];
    }
    const monthAcc =
      query.type === "month"
        ? { [query.date]: [] }
        : monthsZeroStart.reduce<Record<string, CrimeEntry[]>>((midAcc, month) => {
            midAcc[`${query.date}-${month}`] = [];
            return midAcc;
          }, {});
    const acc = allCategories.reduce<Record<string, Record<string, CrimeEntry[]>>>((midAcc, category) => {
      midAcc[category] = cloneDeep(monthAcc);
      return midAcc;
    }, {});

    for (const [month, crimes] of Object.entries(crimesByMonth)) {
      for (const crime of crimes) {
        acc[formattedCategories[crime.category] ?? crime.category]?.[month]?.push(crime);
      }
    }
    return Object.values(acc).map((monthAcc) => Object.values(monthAcc).map((crimes) => crimes.length));
  }
);

export const selectOutcomeCount = createSelector(
  selectQuery,
  selectAllOutcomes,
  selectAllCrimesByMonth,
  (query, allOutcomes, crimesByMonth) => {
    if (!query) {
      return [];
    }
    const monthAcc =
      query.type === "month"
        ? { [query.date]: [] }
        : monthsZeroStart.reduce<Record<string, CrimeEntry[]>>((midAcc, month) => {
            midAcc[`${query.date}-${month}`] = [];
            return midAcc;
          }, {});
    const acc = allOutcomes.reduce<Record<string, Record<string, CrimeEntry[]>>>((midAcc, category) => {
      midAcc[category] = cloneDeep(monthAcc);
      return midAcc;
    }, {});

    for (const [month, crimes] of Object.entries(crimesByMonth)) {
      for (const crime of crimes) {
        if (crime.outcome_status) {
          acc[crime.outcome_status.category]?.[month]?.push(crime);
        }
      }
    }
    return Object.values(acc).map((monthAcc) => Object.values(monthAcc).map((crimes) => crimes.length));
  }
);
