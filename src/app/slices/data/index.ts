import {
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
  isAnyOf,
  PayloadAction,
  UnsubscribeListener,
} from "@reduxjs/toolkit";
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
        console.log(action.error);
        notify({ title: "Failed to get crime categories" });
      },
    }),
    startAppListening({
      matcher: isAnyOf(dataApi.endpoints.getMonthData.matchRejected, dataApi.endpoints.getYearData.matchRejected),
      effect: (action) => {
        console.log(action.error);
        if (action.error.name !== "ConditionError") {
          notify({ title: "Failed to get crime data" });
        }
      },
    }),
  ];
  return (...args: Parameters<UnsubscribeListener>) => subscriptions.map((subscription) => subscription(...args));
};

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
  reducers: {
    newQuery: (state, { payload }: PayloadAction<Query>) => {
      state.query = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(dataApi.endpoints.getCrimeCategories.matchFulfilled, (state, { payload }) => {
        state.formattedCategories = payload;
      })
      .addMatcher(
        isAnyOf(dataApi.endpoints.getMonthData.matchPending, dataApi.endpoints.getYearData.matchPending),
        (state, { meta: { requestId } }) => {
          state.loadingId = requestId;
        }
      )
      .addMatcher(
        isAnyOf(dataApi.endpoints.getMonthData.matchFulfilled, dataApi.endpoints.getYearData.matchFulfilled),
        (
          state,
          {
            payload,
            meta: {
              arg: { originalArgs },
            },
          }
        ) => {
          state.query = originalArgs;
          crimeAdapter.setAll(state.crimes, payload);
          state.initialLoad = false;
        }
      )
      .addMatcher(
        isAnyOf(
          dataApi.endpoints.getMonthData.matchFulfilled,
          dataApi.endpoints.getYearData.matchFulfilled,
          dataApi.endpoints.getMonthData.matchRejected,
          dataApi.endpoints.getYearData.matchRejected
        ),
        (state, { meta: { requestId } }) => {
          if (state.loadingId === requestId) {
            state.loadingId = "";
          }
        }
      );
  },
});

export const { newQuery } = dataSlice.actions;

export default dataSlice.reducer;

export const {
  selectIds: selectCrimeIds,
  selectEntities: selectCrimeMap,
  selectAll: selectAllCrimes,
  selectTotal: selectCrimeTotal,
  selectById: selectCrimeById,
} = crimeAdapter.getSelectors((state: RootState) => state.data.crimes);

export const selectInitialLoad = (state: RootState) => state.data.initialLoad;

export const selectQuery = (state: RootState) => state.data.query;

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
