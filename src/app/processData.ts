import type { CrimeEntry, MonthQuery, ProcessedData, YearQuery } from "../util/types";

export const processMonthData = (data: CrimeEntry[], query: MonthQuery): ProcessedData => {
  const firstEntry = data[0];
  const location = firstEntry ? `${firstEntry.location.latitude}, ${firstEntry.location.longitude}` : "";
  const queryLocation = `${query.lat},${query.lng}`;
  return { type: "month", location: location, queryLocation: queryLocation, count: data.length };
};

export const processYearData = (data: CrimeEntry[][], query: YearQuery): ProcessedData => {
  const firstEntry = data[0][0];
  const location = firstEntry ? `${firstEntry.location.latitude}, ${firstEntry.location.longitude}` : "";
  const queryLocation = `${query.lat},${query.lng}`;
  return { type: "year", location: location, queryLocation: queryLocation, count: data.map((arr) => arr.length) };
};
