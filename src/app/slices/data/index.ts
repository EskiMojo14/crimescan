import { createSelector, createSlice, isAnyOf, PayloadAction, UnsubscribeListener } from "@reduxjs/toolkit";
import cloneDeep from "lodash.clonedeep";
import { RootState } from "/src/app/store";
import { alphabeticalSort, promiseAllSeries, uniqueArray } from "@s/util/functions";
import { CrimeEntry, Query } from "./types";
import { baseApi } from "@s/api";
import { AppStartListening } from "@mw/listener";
import { notify } from "/src/app/snackbarQueue";

const months = [...Array(12)].map((_, i) => ++i);

const monthsZeroStart = months.map((month) => (month > 9 ? month.toString() : `0${month}`));

export const dataApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getCrimeCategories: builder.query<Record<string, string>, void>({
      query: () => "crime-categories",
      transformResponse: (response: { url: string; name: string }[]) =>
        response.reduce<Record<string, string>>((acc, { url, name }) => {
          acc[url] = name;
          return acc;
        }, {}),
    }),
    getMonthData: builder.query<CrimeEntry[], Query>({
      query: ({ date, lat, lng }) => `crimes-at-location?date=${date}&lat=${lat}&lng=${lng}`,
    }),
    getYearData: builder.query<CrimeEntry[], Query>({
      queryFn: async ({ date, lat, lng }) => {
        try {
          const result = await promiseAllSeries<CrimeEntry[]>(
            monthsZeroStart.map(
              (month) => () =>
                fetch(`https://data.police.uk/api/crimes-at-location?date=${date}-${month}&lat=${lat}&lng=${lng}`).then(
                  (response) => response.json()
                )
            ),
            100
          );
          return {
            data: result.flat(),
          };
        } catch (e: any) {
          return { error: e.message };
        }
      },
    }),
  }),
});

export const { useGetCrimeCategoriesQuery, useGetMonthDataQuery, useGetYearDataQuery } = dataApi;

export const setupDataApiErrorListeners = (startAppListening: AppStartListening) => {
  const subscriptions = [
    startAppListening({
      matcher: dataApi.endpoints.getCrimeCategories.matchRejected,
      effect: (action) => {
        if (action.error.name !== "ConditionError") {
          console.log(action.error);
          notify({ title: "Failed to get crime categories" });
        }
      },
    }),
    startAppListening({
      matcher: isAnyOf(dataApi.endpoints.getMonthData.matchRejected, dataApi.endpoints.getYearData.matchRejected),
      effect: (action) => {
        if (action.error.name !== "ConditionError") {
          console.log(action.error);
          notify({ title: "Failed to get crime data" });
        }
      },
    }),
  ];
  return (...args: Parameters<UnsubscribeListener>) => subscriptions.map((subscription) => subscription(...args));
};

type DataState = {
  query: Query | undefined;
};

export const initialState: DataState = {
  query: undefined,
};

export const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    newQuery: (state, { payload }: PayloadAction<Query>) => {
      state.query = payload;
    },
  },
});

export const { newQuery } = dataSlice.actions;

export default dataSlice.reducer;

export const selectQuery = (state: RootState) => state.data.query;

const selectCrimeEntry = (data: CrimeEntry[] | undefined) => data;

const selectQueryResult = (data: CrimeEntry[] | undefined, query?: Query | undefined) => query;

const selectFormattedCategories = (
  data: CrimeEntry[] | undefined,
  query: Query | undefined,
  formattedCategories?: Record<string, string> | undefined
) => formattedCategories;

export const selectAllCategories = createSelector(
  selectCrimeEntry,
  selectFormattedCategories,
  (allCrimes = [], formattedCategories) =>
    alphabeticalSort(uniqueArray(allCrimes.map(({ category }) => formattedCategories?.[category] ?? category)))
);

export const selectAllOutcomes = createSelector(selectCrimeEntry, (allCrimes = []) => {
  const outcomes = new Set<string>();
  for (const crime of allCrimes) {
    if (crime.outcome_status) {
      outcomes.add(crime.outcome_status.category);
    }
  }
  return alphabeticalSort(Array.from(outcomes));
});

export const selectAllCrimesByMonth = createSelector(selectCrimeEntry, selectQueryResult, (crimes = [], query) => {
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

export const selectCountSeries = createSelector(selectQueryResult, selectAllCrimesByMonth, (query, allCrimes) => {
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
  selectQueryResult,
  selectFormattedCategories,
  selectAllCategories,
  selectAllCrimesByMonth,
  (query, formattedCategories = {}, allCategories, crimesByMonth) => {
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
  selectQueryResult,
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
