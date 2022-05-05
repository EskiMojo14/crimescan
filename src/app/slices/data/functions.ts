import { CrimeEntry } from "@s/data/types";

export const selectFirstLocation = ([crimeEntry]: (CrimeEntry | undefined)[]) => {
  return crimeEntry && { lat: crimeEntry.location.latitude, lng: crimeEntry.location.longitude };
};
