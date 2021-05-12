import React from "react";
import "./App.scss";
import { Logo } from "./components/util/Logo";

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
  return <Logo rotate />;
}
export default App;
