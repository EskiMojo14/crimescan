import type { CrimeEntry, MonthQuery, ProcessedData, YearQuery } from "../util/types";
import { uniqueArray, alphabeticalSort } from "../util/functions";

export const processMonthData = (data: CrimeEntry[], query: MonthQuery): ProcessedData => {
  const firstEntry = data[0];
  const location = firstEntry ? `${firstEntry.location.latitude}, ${firstEntry.location.longitude}` : "";
  const queryLocation = `${query.lat},${query.lng}`;

  const allCategories = alphabeticalSort(uniqueArray(data.map((entry) => entry.category)));

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

  const count = data.map((arr) => arr.length);

  const allCategories = alphabeticalSort(
    uniqueArray(data.map((entries) => entries.map((entry) => entry.category)).flat(1))
  );

  return { type: "year", location: location, queryLocation: queryLocation, allCategories: allCategories, count: count };
};
