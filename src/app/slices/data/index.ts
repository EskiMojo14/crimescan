import type { PayloadAction, UnsubscribeListener } from "@reduxjs/toolkit";
import { createSelector, createSlice, isAnyOf } from "@reduxjs/toolkit";
import cloneDeep from "lodash.clonedeep";
import type { RootState } from "/src/app/store";
import { alphabeticalSort, promiseAllSeries } from "@s/util/functions";
import type { CrimeEntry, Query } from "./types";
import { baseApi } from "@s/api";
import type { AppStartListening } from "@mw/listener";
import { notify } from "/src/app/snackbar-queue";

const months = [...Array(12)].map((_, i) => ++i);

const monthsZeroStart = months.map((month) => (month > 9 ? month.toString() : `0${month}`));

export const dataApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCrimeCategories: builder.query<Record<string, string>, void>({
      query: () => "crime-categories",
      transformResponse: (response: { name: string; url: string }[]) =>
        response.reduce<Record<string, string>>((acc, { name, url }) => {
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
  overrideExisting: true,
});

export const { useGetCrimeCategoriesQuery, useGetMonthDataQuery, useGetYearDataQuery } = dataApi;

export const setupDataApiErrorListeners = (startAppListening: AppStartListening) => {
  const subscriptions = [
    startAppListening({
      effect: (action) => {
        if (action.error.name !== "ConditionError") {
          console.log(action.error);
          notify({ title: "Failed to get crime categories" });
        }
      },
      matcher: dataApi.endpoints.getCrimeCategories.matchRejected,
    }),
    startAppListening({
      effect: (action) => {
        if (action.error.name !== "ConditionError") {
          console.log(action.error);
          notify({ title: "Failed to get crime data" });
        }
      },
      matcher: isAnyOf(dataApi.endpoints.getMonthData.matchRejected, dataApi.endpoints.getYearData.matchRejected),
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
  initialState,
  name: "data",
  reducers: {
    newQuery: (state, { payload }: PayloadAction<Query>) => {
      state.query = payload;
    },
  },
});

export const { newQuery } = dataSlice.actions;

export default dataSlice.reducer;

export const selectQuery = (state: RootState) => state.data.query;

export const selectFirstLocation = ([crimeEntry]: (CrimeEntry | undefined)[] = []) =>
  crimeEntry && { lat: crimeEntry.location.latitude, lng: crimeEntry.location.longitude };

const selectCrimeEntries = (data: CrimeEntry[] | undefined) => data;

const selectQueryParam = (data: CrimeEntry[] | undefined, query?: Query | undefined) => query;

const selectFormattedCategories = (
  data: CrimeEntry[] | undefined,
  query: Query | undefined,
  formattedCategories?: Record<string, string> | undefined
) => formattedCategories;

export const selectAllCategories = createSelector(
  selectCrimeEntries,
  selectFormattedCategories,
  (allCrimes, formattedCategories = {}) => {
    if (!allCrimes) {
      return [];
    }
    const categories = new Set<string>();
    for (const { category } of allCrimes) {
      categories.add(formattedCategories[category] ?? category);
    }
    return alphabeticalSort(Array.from(categories));
  }
);

export const selectAllOutcomes = createSelector(selectCrimeEntries, (allCrimes = []) => {
  if (!allCrimes) {
    return [];
  }
  const outcomes = new Set<string>();
  for (const crime of allCrimes) {
    if (crime.outcome_status) {
      outcomes.add(crime.outcome_status.category);
    }
  }
  return alphabeticalSort(Array.from(outcomes));
});

export const selectAllCrimesByMonth = createSelector(selectCrimeEntries, selectQueryParam, (crimes = [], query) => {
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

export const selectCountSeries = createSelector(selectQueryParam, selectAllCrimesByMonth, (query, allCrimes) => {
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
  selectQueryParam,
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
  selectQueryParam,
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
