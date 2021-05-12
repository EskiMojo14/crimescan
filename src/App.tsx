import React, { useState } from "react";
import store from "./app/store";
import { Provider } from "react-redux";
import { queue } from "./app/snackbarQueue";
import { SnackbarQueue } from "@rmwc/snackbar";
import { DrawerAppContent } from "@rmwc/drawer";
import { DrawerSettings } from "./components/input/DrawerSettings";
import "./App.scss";
import "normalize.css";

function App() {
  const getData = (month: string, lat: string, lng: string) => {
    setLoading(true);
    fetch(`https://data.police.uk/api/crimes-at-location?date=${month}&lat=${lat}&lng=${lng}`)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        queue.notify({ title: "Failed to get crime data: " + error });
        setLoading(false);
      });
  };
  const [loading, setLoading] = useState(false);
  return (
    <Provider store={store}>
      <DrawerSettings loading={loading} getData={getData} />
      <DrawerAppContent></DrawerAppContent>
      <SnackbarQueue messages={queue.messages} />
    </Provider>
  );
}
export default App;
