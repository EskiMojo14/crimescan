import React, { useEffect, useState } from "react";
import { exampleData } from "./util/constants";
import { useAppDispatch } from "./app/hooks";
import { processData } from "./app/processData";
import { setAll } from "./components/display/dataSlice";
import { queue } from "./app/snackbarQueue";
import { SnackbarQueue } from "@rmwc/snackbar";
import { DrawerAppContent } from "@rmwc/drawer";
import { DrawerSettings } from "./components/input/DrawerSettings";
import "./App.scss";
import "normalize.css";

function App() {
  const dispatch = useAppDispatch();
  const getData = (query: { month: string; lat: string; lng: string }) => {
    const { month, lat, lng } = query;
    setLoading(true);
    fetch(`https://data.police.uk/api/crimes-at-location?date=${month}&lat=${lat}&lng=${lng}`)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        const data = processData(result, query);
        console.log(data);
        dispatch(setAll(data));
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        queue.notify({ title: "Failed to get crime data: " + error });
        setLoading(false);
      });
  };

  // Process dummy data instead of calling API every time.
  const createData = () => {
    const data = processData(exampleData, { month: "2020-04", lat: "51.378370", lng: "-2.359207" });
    dispatch(setAll(data));
    console.log(data);
  };
  useEffect(createData, []);

  const [loading, setLoading] = useState(false);
  return (
    <>
      <DrawerSettings loading={loading} getData={getData} />
      <DrawerAppContent></DrawerAppContent>
      <SnackbarQueue messages={queue.messages} />
    </>
  );
}
export default App;
