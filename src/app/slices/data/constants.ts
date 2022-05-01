import { MonthData, YearData } from "./types";

export const blankMonth: MonthData = {
  type: "month",
  location: "",
  query: {
    type: "month",
    month: "",
    lat: "",
    lng: "",
  },
  count: 0,
  allCategories: [""],
  categoryCount: [0],
  allOutcomes: [""],
  outcomeCount: [0],
};

export const blankYear: YearData = {
  type: "year",
  location: "",
  query: {
    type: "year",
    year: "",
    lat: "",
    lng: "",
  },
  count: [0],
  allCategories: [""],
  categoryCount: [[0]],
  allOutcomes: [""],
  outcomeCount: [[0]],
};
