import React, { useEffect } from "react";
import { exampleData } from "./util/constants";
import { MonthQuery, YearQuery } from "./util/types";
import { useAppDispatch } from "./app/hooks";
import { getMonthData } from "./app/getData";
import { processMonthData } from "./app/processData";
import { setAll } from "./components/display/dataSlice";
import { queue } from "./app/snackbarQueue";
import { SnackbarQueue } from "@rmwc/snackbar";
import { DrawerAppContent } from "@rmwc/drawer";
import { DrawerSettings } from "./components/input/DrawerSettings";
import "./App.scss";
import "normalize.css";

function App() {
  const dispatch = useAppDispatch();
  const getData = (query: MonthQuery | YearQuery) => {
    if (query.type === "month") {
      getMonthData(query);
    }
  };

  // Process dummy data instead of calling API every time.
  const createData = () => {
    const data = processMonthData(exampleData, { type: "month", month: "2020-04", lat: "51.378370", lng: "-2.359207" });
    dispatch(setAll(data));
    console.log(data);
  };
  useEffect(createData, []);

  return (
    <>
      <DrawerSettings getData={getData} />
      <DrawerAppContent></DrawerAppContent>
      <SnackbarQueue messages={queue.messages} />
    </>
  );
}
export default App;
