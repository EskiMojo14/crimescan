import React from "react";
import { DrawerAppContent } from "@rmwc/drawer";
import { DrawerSettings } from "./components/main/DrawerSettings";
import "./App.scss";
import "normalize.css";

function App() {
  const getData = () => {
    const month = "2020-02";
    const lat = "52.629729";
    const lng = "-1.131592";
    fetch(`https://data.police.uk/api/crimes-at-location?date=${month}&lat=${lat}&lng=${lng}`)
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <DrawerSettings />
      <DrawerAppContent></DrawerAppContent>
    </>
  );
}
export default App;
