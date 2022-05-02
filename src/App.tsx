import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@h";
import { loadGoogleMapsAPI } from "@s/maps/functions";
import { selectCrimeTotal, selectQuery } from "@s/data";
import { getCrimeCategories, selectTheme } from "@s/display";
import { queue } from "~/app/snackbarQueue";
import { closeModal, openModal } from "@s/util/functions";
import { SnackbarQueue } from "@rmwc/snackbar";
import { DrawerAppContent } from "@rmwc/drawer";
import { ContentContainer } from "~/components/display/ContentContainer";
import { ContentEmpty } from "~/components/display/ContentEmpty";
import { DrawerSearch } from "~/components/input/DrawerSearch";
import { DrawerSettings } from "~/components/input/DrawerSettings";
import "./App.scss";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getCrimeCategories());
  }, []);
  useEffect(() => {
    try {
      loadGoogleMapsAPI();
    } catch (e) {
      console.log(e);
      queue.notify({ title: "Failed to load Google Maps API." });
    }
  }, []);

  const theme = useAppSelector(selectTheme);
  useEffect(() => {
    document.documentElement.className = theme;
    document
      .querySelector("meta[name=theme-color]")
      ?.setAttribute("content", getComputedStyle(document.documentElement).getPropertyValue("--meta-color"));
  }, [theme]);

  const query = useAppSelector(selectQuery);

  const total = useAppSelector(selectCrimeTotal);

  const [latLng, setLatLng] = useState({ lat: "", lng: "" });

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
      <DrawerSearch open={searchDrawerOpen} close={closeSearch} setLatLng={setLatLng} />
      <DrawerSettings openSearch={openSearch} latLng={latLng} />
      <DrawerAppContent>
        {(!query.lat && !query.lng) || total === 0 ? <ContentEmpty /> : <ContentContainer />}
      </DrawerAppContent>
      <SnackbarQueue messages={queue.messages} />
    </>
  );
}
export default App;
