import type { CrimeEntry, MonthQuery, ProcessedData } from "../util/types";

export const processMonthData = (data: CrimeEntry[], query: MonthQuery): ProcessedData => {
  const firstEntry = data[0];
  const location = firstEntry ? `${firstEntry.location.latitude}, ${firstEntry.location.longitude}` : "";
  const queryLocation = `${query.lat},${query.lng}`;
  return { type: "month", location: location, queryLocation: queryLocation, count: data.length };
};
