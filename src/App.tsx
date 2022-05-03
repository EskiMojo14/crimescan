import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@h";
import { loadGoogleMapsAPI } from "@s/maps/functions";
import { getCrimeCategories, selectCrimeTotal, selectQuery } from "@s/data";
import { cookiesAccepted, selectCookies, selectTheme } from "@s/settings";
import { queue, notify } from "/src/app/snackbarQueue";
import { SnackbarQueue } from "@rmwc/snackbar";
import { DrawerAppContent } from "@rmwc/drawer";
import ContentContainer from "@c/data/ContentContainer";
import ContentEmpty from "@c/data/ContentEmpty";
import DrawerSearch from "@c/data/DrawerSearch";
import DrawerQuery from "@c/data/DrawerQuery";
import useBoolStates from "@h/useBoolStates";
import "./App.scss";
import DrawerFavourites from "@c/user/DrawerFavourites";

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
  const [closeSearch, openSearch] = useBoolStates(setSearchDrawerOpen, "setSearchDrawerOpen");

  const [favouritesDrawerOpen, setFavouritesDrawerOpen] = useState(false);
  const [closeFavourites, openFavourites] = useBoolStates(setFavouritesDrawerOpen, "setFavouritesDrawerOpen");

  return (
    <>
      <DrawerFavourites open={favouritesDrawerOpen} onClose={closeFavourites} />
      <DrawerSearch open={searchDrawerOpen} close={closeSearch} setLatLng={setLatLng} />
      <DrawerQuery openSearch={openSearch} openFavourites={openFavourites} latLng={latLng} />
      <DrawerAppContent>{!query || total === 0 ? <ContentEmpty /> : <ContentContainer />}</DrawerAppContent>
      <SnackbarQueue messages={queue.messages} />
    </>
  );
}
export default App;
