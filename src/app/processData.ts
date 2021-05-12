import type { CrimeEntry, ProcessedData } from "../util/types";

export const processData = (data: CrimeEntry[], query: { month: string; lat: string; lng: string }): ProcessedData => {
  const firstEntry = data[0];
  const location = firstEntry ? `${firstEntry.location.latitude}, ${firstEntry.location.longitude}` : "";
  const queryLocation = `${query.lat},${query.lng}`;
  return { location: location, queryLocation: queryLocation, count: data.length };
};
