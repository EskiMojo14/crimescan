import React, { useEffect, useState } from "react";
import { exampleData } from "./util/constants";
import { ProcessedData } from "./util/types";
import store from "./app/store";
import { processData } from "./app/processData";
import { Provider } from "react-redux";
import { queue } from "./app/snackbarQueue";
import { SnackbarQueue } from "@rmwc/snackbar";
import { DrawerAppContent } from "@rmwc/drawer";
import { DrawerSettings } from "./components/input/DrawerSettings";
import "./App.scss";
import "normalize.css";

function App() {
  const [data, setData] = useState<ProcessedData>({ location: "", queryLocation: "", count: 0 });
  const getData = (month: string, lat: string, lng: string) => {
    setLoading(true);
    fetch(`https://data.police.uk/api/crimes-at-location?date=${month}&lat=${lat}&lng=${lng}`)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        const data = processData(result, { month, lat, lng });
        console.log(data);
        setData(data);
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
    setData(data);
    console.log(data);
  };
  useEffect(createData, []);

  const [loading, setLoading] = useState(false);
  return (
    <Provider store={store}>
      <DrawerSettings loading={loading} getData={getData} data={data} />
      <DrawerAppContent></DrawerAppContent>
      <SnackbarQueue messages={queue.messages} />
    </Provider>
  );
}
export default App;
