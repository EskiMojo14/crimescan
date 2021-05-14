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

  const formattedEntries: CrimeEntry[] = data.map((entry) => {
    return { ...entry, category: formatCategory(entry.category) };
  });

  const allCategories = alphabeticalSort(uniqueArray(formattedEntries.map((entry) => entry.category)));

  const count = data.length;

  const categoryCount = allCategories.map((category) =>
    countInArray(
      formattedEntries.map((entry) => entry.category),
      category
    )
  );

  return {
    type: "month",
    location: location,
    query: query,
    allCategories: allCategories,
    count: count,
    categoryCount: categoryCount,
  };
};

export const processYearData = (data: CrimeEntry[][], query: YearQuery): YearData => {
  const firstEntry = data[0][0];
  const location = firstEntry ? `${firstEntry.location.latitude}, ${firstEntry.location.longitude}` : "";

  const formattedEntries: CrimeEntry[][] = data.map((entries) =>
    entries.map((entry) => {
      return { ...entry, category: formatCategory(entry.category) };
    })
  );

  const allCategories = alphabeticalSort(
    uniqueArray(formattedEntries.map((entries) => entries.map((entry) => entry.category)).flat(1))
  );

  const count = data.map((arr) => arr.length);

  const categoryCount = allCategories.map((category) =>
    formattedEntries.map((entries) =>
      countInArray(
        entries.map((entry) => entry.category),
        category
      )
    )
  );

  return {
    type: "year",
    location: location,
    query: query,
    allCategories: allCategories,
    count: count,
    categoryCount: categoryCount,
  };
};
