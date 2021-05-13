import type { CrimeEntry, MonthQuery, ProcessedData, YearQuery } from "../util/types";
import { uniqueArray, alphabeticalSort, hasKey } from "../util/functions";
import store from "./store";

export const formatCategory = (category: string) => {
  const state = store.getState();
  const { formattedCategories } = state.display;
  if (hasKey(formattedCategories, category)) {
    return formattedCategories[category];
  }
  return category;
};

export const processMonthData = (data: CrimeEntry[], query: MonthQuery): ProcessedData => {
  const firstEntry = data[0];
  const location = firstEntry ? `${firstEntry.location.latitude}, ${firstEntry.location.longitude}` : "";
  const queryLocation = `${query.lat},${query.lng}`;

  const formattedEntries: CrimeEntry[] = data.map((entry) => {
    return { ...entry, category: formatCategory(entry.category) };
  });

  const allCategories = alphabeticalSort(uniqueArray(formattedEntries.map((entry) => entry.category)));

  const count = data.length;
  return {
    type: "month",
    location: location,
    queryLocation: queryLocation,
    allCategories: allCategories,
    count: count,
  };
};

export const processYearData = (data: CrimeEntry[][], query: YearQuery): ProcessedData => {
  const firstEntry = data[0][0];
  const location = firstEntry ? `${firstEntry.location.latitude}, ${firstEntry.location.longitude}` : "";
  const queryLocation = `${query.lat},${query.lng}`;

  const formattedEntries: CrimeEntry[][] = data.map((entries) =>
    entries.map((entry) => {
      return { ...entry, category: formatCategory(entry.category) };
    })
  );

  const allCategories = alphabeticalSort(
    uniqueArray(formattedEntries.map((entries) => entries.map((entry) => entry.category)).flat(1))
  );

  const count = data.map((arr) => arr.length);

  return { type: "year", location: location, queryLocation: queryLocation, allCategories: allCategories, count: count };
};
