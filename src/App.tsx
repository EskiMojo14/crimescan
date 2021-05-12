import React, { useState } from "react";
import { DrawerAppContent } from "@rmwc/drawer";
import { DrawerSettings } from "./components/input/DrawerSettings";
import "./App.scss";
import "normalize.css";
import { Provider } from "react-redux";
import store from "./app/store";

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
      });
  };
  const [loading, setLoading] = useState(false);
  return (
    <Provider store={store}>
      <DrawerSettings loading={loading} getData={getData} />
      <DrawerAppContent></DrawerAppContent>
    </Provider>
  );
}
export default App;
