import React, { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@h";
import { loadGoogleMapsAPI } from "@s/maps/functions";
import { selectCrimeTotal, selectQuery, useGetCrimeCategoriesQuery } from "@s/data";
import { cookiesAccepted, selectCookies, selectTheme } from "@s/settings";
import { queue as dialogQueue } from "/src/app/dialogQueue";
import { queue as snackbarQueue, notify } from "/src/app/snackbarQueue";
import { DialogQueue } from "@rmwc/dialog";
import { SnackbarQueue } from "@rmwc/snackbar";
import { DrawerAppContent } from "@rmwc/drawer";
import ContentContainer from "@c/data/ContentContainer";
import ContentEmpty from "@c/data/ContentEmpty";
import DrawerSearch from "@c/data/DrawerSearch";
import DrawerQuery from "@c/data/DrawerQuery";
import useBoolStates from "@h/useBoolStates";
import DrawerLocations from "@c/user/DrawerLocations";
import "./App.scss";
import useHandleErrors from "@h/useHandleErrors";

function App() {
  const dispatch = useAppDispatch();

  const { error } = useGetCrimeCategoriesQuery();
  useHandleErrors(
    useCallback(
      (e: NonNullable<typeof error>) => {
        console.log(e);
        notify({ title: "Failed to get crime categories" });
      },
      [notify]
    ),
    error
  );

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

  const [locationsDrawerOpen, setLocationsDrawerOpen] = useState(false);
  const [closeLocations, openLocations] = useBoolStates(setLocationsDrawerOpen, "setLocationsDrawerOpen");

  return (
    <>
      <DrawerLocations open={locationsDrawerOpen} onClose={closeLocations} latLng={latLng} setLatLng={setLatLng} />
      <DrawerSearch open={searchDrawerOpen} close={closeSearch} setLatLng={setLatLng} />
      <DrawerQuery openSearch={openSearch} openLocations={openLocations} latLng={latLng} />
      <DrawerAppContent>{!query || total === 0 ? <ContentEmpty /> : <ContentContainer />}</DrawerAppContent>
      <SnackbarQueue messages={snackbarQueue.messages} />
      <DialogQueue dialogs={dialogQueue.dialogs} />
    </>
  );
}
export default App;
