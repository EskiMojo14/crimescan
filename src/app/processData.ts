import type { CrimeEntry, MonthData, MonthQuery, YearData, YearQuery } from "../util/types";
import { uniqueArray, alphabeticalSort, hasKey, countInArray } from "../util/functions";
import store from "./store";

export const formatCategory = (category: string) => {
  const state = store.getState();
  const { formattedCategories } = state.display;
  if (hasKey(formattedCategories, category)) {
    return formattedCategories[category];
  }
  return category;
};

export const processMonthData = (data: CrimeEntry[], query: MonthQuery): MonthData => {
  const firstEntry = data[0];
  const location = firstEntry ? `${firstEntry.location.latitude}, ${firstEntry.location.longitude}` : "";

  const count = data.length;

  const allCategories = alphabeticalSort(uniqueArray(data.map((entry) => formatCategory(entry.category))));

  const categoryCount = allCategories.map((category) =>
    countInArray(
      data.map((entry) => formatCategory(entry.category)),
      category
    )
  );

  const allOutcomes = alphabeticalSort(
    uniqueArray(data.map((entry) => (entry.outcome_status ? entry.outcome_status.category : "")))
  ).filter((val) => Boolean(val));

  const outcomeCount = allOutcomes.map((outcome) =>
    countInArray(
      data.map((entry) => (entry.outcome_status ? entry.outcome_status.category : "")),
      outcome
    )
  );

  return {
    type: "month",
    location: location,
    query: query,
    count: count,
    allCategories: allCategories,
    categoryCount: categoryCount,
    allOutcomes: allOutcomes,
    outcomeCount: outcomeCount,
  };
};

export const processYearData = (data: CrimeEntry[][], query: YearQuery): YearData => {
  const firstEntry = data.filter((entries) => !!entries[0])[0][0];
  const location = firstEntry ? `${firstEntry.location.latitude}, ${firstEntry.location.longitude}` : "";

  const count = data.map((arr) => arr.length);

  const allCategories = alphabeticalSort(
    uniqueArray(data.map((entries) => entries.map((entry) => formatCategory(entry.category))).flat(1))
  );

  const categoryCount = allCategories.map((category) =>
    data.map((entries) =>
      countInArray(
        entries.map((entry) => formatCategory(entry.category)),
        category
      )
    )
  );

  const allOutcomes = alphabeticalSort(
    uniqueArray(
      data.map((entries) => entries.map((entry) => (entry.outcome_status ? entry.outcome_status.category : ""))).flat(1)
    )
  ).filter((val) => Boolean(val));

  const outcomeCount = allOutcomes.map((category) =>
    data.map((entries) =>
      countInArray(
        entries.map((entry) => (entry.outcome_status ? entry.outcome_status.category : "")),
        category
      )
    )
  );

  return {
    type: "year",
    location: location,
    query: query,
    count: count,
    allCategories: allCategories,
    categoryCount: categoryCount,
    allOutcomes: allOutcomes,
    outcomeCount: outcomeCount,
  };
};
