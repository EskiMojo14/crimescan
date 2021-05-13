import React from "react";

/** Alias for standard HTML props. */

export type HTMLProps = React.HTMLAttributes<HTMLElement>;

/** Crime entry format, based on https://data.police.uk/docs/method/crimes-at-location/ */

export type CrimeEntry = {
  category: string;
  location_type: string;
  location: {
    latitude: string;
    street: {
      id: number;
      name: string;
    };
    longitude: string;
  };
  context: string;
  outcome_status: null | {
    category: string;
    date: string;
  };
  persistent_id: string;
  id: number;
  location_subtype: string;
  month: string;
};

/** Query types */

export type MonthQuery = {
  type: "month";
  month: string;
  lat: string;
  lng: string;
};

export type YearQuery = {
  type: "year";
  year: string;
  lat: string;
  lng: string;
};

/** Processed statistics data */

export type MonthData = {
  type: "month";
  location: string;
  queryLocation: string;
  allCategories: string[];
  count: number;
};

export type YearData = {
  type: "year";
  location: string;
  queryLocation: string;
  allCategories: string[];
  count: number[];
};

export type ProcessedData = MonthData | YearData;
