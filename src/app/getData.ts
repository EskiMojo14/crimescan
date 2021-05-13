import { setAll } from "../components/display/dataSlice";
import { setLoading } from "../components/display/displaySlice";
import { MonthQuery } from "../util/types";
import { processMonthData } from "./processData";
import { queue } from "./snackbarQueue";
import store from "./store";

export const getMonthData = (query: MonthQuery) => {
  const { dispatch } = store;
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
