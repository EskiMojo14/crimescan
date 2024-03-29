import { useEffect, useState } from "react";
import ContentContainer from "@c/data/content-container";
import ContentEmpty from "@c/data/content-empty";
import DrawerQuery from "@c/data/drawer-query";
import DrawerSearch from "@c/data/drawer-search";
import DrawerLocations from "@c/locations/drawer-locations";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { DialogQueue } from "@rmwc/dialog";
import { DrawerAppContent } from "@rmwc/drawer";
import { SnackbarQueue } from "@rmwc/snackbar";
import { loadGoogleMapsAPI } from "@s/maps/functions";
import { useAppDispatch, useAppSelector } from "@h";
import useBoolStates from "@h/use-bool-states";
import { dataApi, selectQuery, useGetCrimeCategoriesQuery, useGetMonthDataQuery, useGetYearDataQuery } from "@s/data";
import { cookiesAccepted, selectCookies, selectTheme } from "@s/settings";
import { queue as dialogQueue } from "/src/app/dialog-queue";
import { notify, queue as snackbarQueue } from "/src/app/snackbar-queue";
import "./App.scss";

const App = () => {
  const dispatch = useAppDispatch();

  const query = useAppSelector(selectQuery);

  const { monthTotal } = useGetMonthDataQuery(!query || query.type !== "month" ? skipToken : query, {
    selectFromResult: ({ data }) => ({
      monthTotal: data?.length,
    }),
  });
  const { yearTotal } = useGetYearDataQuery(!query || query.type !== "year" ? skipToken : query, {
    selectFromResult: ({ data }) => ({
      yearTotal: data?.length,
    }),
  });

  const prefetchCrimeCategories = dataApi.usePrefetch("getCrimeCategories");

  useEffect(() => prefetchCrimeCategories(), []);

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

  const [latLng, setLatLng] = useState({ lat: "", lng: "" });

  const [searchDrawerOpen, setSearchDrawerOpen] = useState(false);
  const [closeSearch, openSearch] = useBoolStates(setSearchDrawerOpen, "setSearchDrawerOpen");

  const [locationsDrawerOpen, setLocationsDrawerOpen] = useState(false);
  const [closeLocations, openLocations] = useBoolStates(setLocationsDrawerOpen, "setLocationsDrawerOpen");

  return (
    <>
      <DrawerLocations latLng={latLng} onClose={closeLocations} open={locationsDrawerOpen} setLatLng={setLatLng} />
      <DrawerSearch close={closeSearch} open={searchDrawerOpen} setLatLng={setLatLng} />
      <DrawerQuery latLng={latLng} openLocations={openLocations} openSearch={openSearch} setLatLng={setLatLng} />
      <DrawerAppContent>
        {!query || (query.type === "month" ? monthTotal : yearTotal) === 0 ? <ContentEmpty /> : <ContentContainer />}
      </DrawerAppContent>
      <SnackbarQueue messages={snackbarQueue.messages} />
      <DialogQueue dialogs={dialogQueue.dialogs} />
    </>
  );
};
export default App;
