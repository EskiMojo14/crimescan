/** Crime entry format, based on https://data.police.uk/docs/method/crimes-at-location/ */

export type CrimeEntry = {
  category: string;
  context: string;
  id: number;
  location: {
    latitude: string;
    longitude: string;
    street: {
      id: number;
      name: string;
    };
  };
  location_subtype: string;
  location_type: string;
  month: string;
  outcome_status: {
    category: string;
    date: string;
  } | null;
  persistent_id: string;
};

/** Arguments to pass to data fetching thunks. */

export type Query = {
  date: string;
  lat: string;
  lng: string;
  type: "month" | "year";
};
