import React, { useEffect, useState } from "react";
import { useAppSelector } from "@h";
import { loadGoogleMapsAPI } from "@s/maps/functions";
import { getCrimeCategories } from "@s/data/functions";
import { selectEmptyData, selectQuery } from "@s/data";
import { queue } from "~/app/snackbarQueue";
import { closeModal, openModal } from "@s/util/functions";
import { SnackbarQueue } from "@rmwc/snackbar";
import { DrawerAppContent } from "@rmwc/drawer";
import { ContentContainer } from "~/components/display/ContentContainer";
import { ContentEmpty } from "~/components/display/ContentEmpty";
import { DrawerSearch } from "~/components/input/DrawerSearch";
import { DrawerSettings } from "~/components/input/DrawerSettings";
import "./App.scss";
import "normalize.css";

function App() {
  useEffect(getCrimeCategories, []);
  useEffect(loadGoogleMapsAPI, []);

  const query = useAppSelector(selectQuery);

  const emptyData = useAppSelector(selectEmptyData);

  const [searchDrawerOpen, setSearchDrawerOpen] = useState(false);
  const openSearch = () => {
    setSearchDrawerOpen(true);
    openModal("search-drawer");
  };
  const closeSearch = () => {
    setSearchDrawerOpen(false);
    closeModal("search-drawer");
  };

  return (
    <>
      <DrawerSearch open={searchDrawerOpen} close={closeSearch} />
      <DrawerSettings openSearch={openSearch} />
      <DrawerAppContent>
        <ContentEmpty open={(!query.lat && !query.lng) || emptyData} />
        <ContentContainer />
      </DrawerAppContent>
      <SnackbarQueue messages={queue.messages} />
    </>
  );
}
export default App;
