import { setAll } from "../components/display/dataSlice";
import { setCategories, setLoading } from "../components/display/displaySlice";
import { delay } from "../util/functions";
import { MonthQuery, YearQuery } from "../util/types";
import { processMonthData, processYearData } from "./processData";
import { queue } from "./snackbarQueue";
import store from "./store";

export const getCrimeCategories = () => {
  const { dispatch } = store;
  fetch("https://data.police.uk/api/crime-categories")
    .then((response) => response.json())
    .then((value) => {
      console.log(value);
      const keyObject: Record<string, string> = value.reduce(
        (acc: Record<string, string>, item: { url: string; name: string }) => {
          return { ...acc, [item.url]: item.name };
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
      console.log(result);
      const data = processMonthData(result, query);
      console.log(data);
      dispatch(setAll(data));
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
      console.log(result);
      const data = processYearData(result, query);
      console.log(data);
      dispatch(setAll(data));
      dispatch(setLoading(false));
    })
    .catch((error) => {
      console.log(error);
      queue.notify({ title: "Failed to get crime data: " + error });
      dispatch(setLoading(false));
    });
};
