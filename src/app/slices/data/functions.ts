import { setEmptyData, setMonth, setYear } from ".";
import { CrimeEntry, MonthData, YearData, MonthQuery, YearQuery } from "./types";
import { setCategories, setLoading } from "../display";
import { delay, uniqueArray, alphabeticalSort, hasKey, countInArray } from "../../../util/functions";
import { queue } from "../../snackbarQueue";
import store from "../../store";

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

  const count = data.length;

  const allCategories = alphabeticalSort(uniqueArray(data.map((entry) => formatCategory(entry.category))));

  const categoryCount = allCategories.map((category) =>
    countInArray(
      data.map((entry) => formatCategory(entry.category)),
      category
    )
  );

  const allOutcomes = alphabeticalSort(
    uniqueArray(data.map((entry) => (entry.outcome_status ? entry.outcome_status.category : "")))
  ).filter((val) => Boolean(val));

  const outcomeCount = allOutcomes.map((outcome) =>
    countInArray(
      data.map((entry) => (entry.outcome_status ? entry.outcome_status.category : "")),
      outcome
    )
  );

  return {
    type: "month",
    location: location,
    query: query,
    count: count,
    allCategories: allCategories,
    categoryCount: categoryCount,
    allOutcomes: allOutcomes,
    outcomeCount: outcomeCount,
  };
};

export const processYearData = (data: CrimeEntry[][], query: YearQuery): YearData => {
  const firstEntry = data.filter((entries) => !!entries[0])[0][0];
  const location = firstEntry ? `${firstEntry.location.latitude}, ${firstEntry.location.longitude}` : "";

  const count = data.map((arr) => arr.length);

  const allCategories = alphabeticalSort(
    uniqueArray(data.map((entries) => entries.map((entry) => formatCategory(entry.category))).flat(1))
  );

  const categoryCount = allCategories.map((category) =>
    data.map((entries) =>
      countInArray(
        entries.map((entry) => formatCategory(entry.category)),
        category
      )
    )
  );

  const allOutcomes = alphabeticalSort(
    uniqueArray(
      data.map((entries) => entries.map((entry) => (entry.outcome_status ? entry.outcome_status.category : ""))).flat(1)
    )
  ).filter((val) => Boolean(val));

  const outcomeCount = allOutcomes.map((category) =>
    data.map((entries) =>
      countInArray(
        entries.map((entry) => (entry.outcome_status ? entry.outcome_status.category : "")),
        category
      )
    )
  );

  return {
    type: "year",
    location: location,
    query: query,
    count: count,
    allCategories: allCategories,
    categoryCount: categoryCount,
    allOutcomes: allOutcomes,
    outcomeCount: outcomeCount,
  };
};

export const getCrimeCategories = () => {
  const { dispatch } = store;
  fetch("https://data.police.uk/api/crime-categories")
    .then((response) => response.json())
    .then((value) => {
      const keyObject: Record<string, string> = value.reduce(
        (acc: Record<string, string>, { url, name }: { url: string; name: string }) => {
          acc[url] = name;
          return acc;
        },
        {}
      );
      dispatch(setCategories(keyObject));
    });
};

export const getMonthData = (query: MonthQuery) => {
  const { dispatch } = store;
  // https://daveceddia.com/access-redux-store-outside-react/#dispatch-actions-outside-a-react-component
  const { month, lat, lng } = query;
  dispatch(setLoading(true));
  fetch(`https://data.police.uk/api/crimes-at-location?date=${month}&lat=${lat}&lng=${lng}`)
    .then((response) => response.json())
    .then((result) => {
      const data = processMonthData(result, query);
      dispatch(setEmptyData(data.count === 0));
      dispatch(setMonth(data));
      dispatch(setLoading(false));
    })
    .catch((error) => {
      console.log(error);
      queue.notify({ title: "Failed to get crime data: " + error });
      dispatch(setLoading(false));
    });
};

export const getYearData = (query: YearQuery) => {
  const { dispatch } = store;
  // https://daveceddia.com/access-redux-store-outside-react/#dispatch-actions-outside-a-react-component
  const { year, lat, lng } = query;
  dispatch(setLoading(true));
  const getMonthData = (month: number) => {
    // Delay to prevent calling API too fast.
    return delay((month - 1) * 100)
      .then(() => fetch(`https://data.police.uk/api/crimes-at-location?date=${year}-${month}&lat=${lat}&lng=${lng}`))
      .then((response) => response.json());
  };
  const months = new Array(12).fill("").map((item, index) => index + 1);
  Promise.all(months.map((month) => getMonthData(month)))
    .then((result) => {
      const data = processYearData(result, query);
      dispatch(setEmptyData(data.count.reduce((a, b) => a + b) === 0));
      dispatch(setYear(data));
      dispatch(setLoading(false));
    })
    .catch((error) => {
      console.log(error);
      queue.notify({ title: "Failed to get crime data: " + error });
      dispatch(setLoading(false));
    });
};
