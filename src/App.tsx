import React, { useEffect } from "react";
import { useAppSelector } from "./app/hooks";
import { getCrimeCategories } from "./app/getData";
import { selectQuery } from "./components/display/dataSlice";
import { queue } from "./app/snackbarQueue";
import { SnackbarQueue } from "@rmwc/snackbar";
import { DrawerAppContent } from "@rmwc/drawer";
import { ContentContainer } from "./components/display/ContentContainer";
import { ContentEmpty } from "./components/display/ContentEmpty";
import { DrawerSettings } from "./components/input/DrawerSettings";
import "./App.scss";
import "normalize.css";

function App() {
  useEffect(getCrimeCategories, []);

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
