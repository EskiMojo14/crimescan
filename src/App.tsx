import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@h";
import { loadGoogleMapsAPI } from "@s/maps/functions";
import { getCrimeCategories, selectCrimeTotal, selectQuery } from "@s/data";
import { cookiesAccepted, selectCookies, selectTheme } from "@s/settings";
import { queue, notify } from "/src/app/snackbarQueue";
import { closeModal, openModal } from "@s/util/functions";
import { SnackbarQueue } from "@rmwc/snackbar";
import { DrawerAppContent } from "@rmwc/drawer";
import { ContentContainer } from "@c/display/ContentContainer";
import { ContentEmpty } from "@c/display/ContentEmpty";
import { DrawerSearch } from "@c/input/DrawerSearch";
import { DrawerSettings } from "@c/input/DrawerSettings";
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
      notify({ title: "Failed to load Google Maps API." });
    }
  }, []);

  const theme = useAppSelector(selectTheme);
  useEffect(() => {
    document.documentElement.className = theme;
    document
      .querySelector("meta[name=theme-color]")
      ?.setAttribute("content", getComputedStyle(document.documentElement).getPropertyValue("--meta-color"));
  }, [theme]);

  const cookies = useAppSelector(selectCookies);
  useEffect(() => {
    if (!cookies) {
      notify({
        actions: [{ label: "Accept", onClick: () => dispatch(cookiesAccepted()) }],
        dismissesOnAction: true,
        onClose: () => dispatch(cookiesAccepted()),
        timeout: 200000,
        title: "By using this site, you consent to use of cookies to store preferences.",
      });
    }
  }, [cookies]);

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
      <DrawerAppContent>{!query || total === 0 ? <ContentEmpty /> : <ContentContainer />}</DrawerAppContent>
      <SnackbarQueue messages={queue.messages} />
    </>
  );
}
export default App;
