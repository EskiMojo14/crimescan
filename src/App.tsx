import React, { useEffect } from "react";
import { exampleData } from "./util/constants";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { getCrimeCategories } from "./app/getData";
import { processMonthData } from "./app/processData";
import { selectQuery, setAll } from "./components/display/dataSlice";
import { queue } from "./app/snackbarQueue";
import { SnackbarQueue } from "@rmwc/snackbar";
import { DrawerAppContent } from "@rmwc/drawer";
import { ContentContainer } from "./components/display/ContentContainer";
import { ContentEmpty } from "./components/display/ContentEmpty";
import { DrawerSettings } from "./components/input/DrawerSettings";
import "./App.scss";
import "normalize.css";

function App() {
  const dispatch = useAppDispatch();

  useEffect(getCrimeCategories, []);

  // Process dummy data instead of calling API every time.
  const createData = () => {
    const data = processMonthData(exampleData, { type: "month", month: "2020-04", lat: "51.378370", lng: "-2.359207" });
    dispatch(setAll(data));
    console.log(data);
  };
  useEffect(createData, []);

  const query = useAppSelector(selectQuery);

  return (
    <>
      <DrawerSettings />
      <DrawerAppContent>
        <ContentEmpty open={!query.lat && !query.lng} />
        <ContentContainer />
      </DrawerAppContent>
      <SnackbarQueue messages={queue.messages} />
    </>
  );
}
export default App;
