import { useMemo, useState } from "react";
import * as React from "react";
import { notify } from "/src/app/snackbar-queue";
import { Button } from "@rmwc/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@rmwc/drawer";
import { IconButton } from "@rmwc/icon-button";
import { LinearProgress } from "@rmwc/linear-progress";
import { TextField } from "@rmwc/textfield";
import { Typography } from "@rmwc/typography";
import { pinColors, statusCodes } from "@s/maps/constants";
import { getGeocodedResults, getStaticMapURL } from "@s/maps/functions";
import type { MapResult } from "@s/maps/types";
import { asyncDebounce } from "@s/util/functions";
import { useAppSelector } from "@h";
import useScrollLock from "@h/use-scroll-lock";
import { selectTheme } from "@s/settings";
import "./drawer-search.scss";
import emptyImg from "@m/empty.svg";

type DrawerSearchProps = {
  close: () => void;
  open: boolean;
  setLatLng: (latLng: { lat: string; lng: string }) => void;
};

export const DrawerSearch = (props: DrawerSearchProps) => {
  useScrollLock(props.open, "search-drawer");

  const theme = useAppSelector(selectTheme);

  const [search, setSearch] = useState("");
  const [result, setResult] = useState<MapResult | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const debouncedGeocodeSearch = useMemo(
    () =>
      asyncDebounce(async (value: string): Promise<MapResult | undefined> => {
        setLoading(true);
        try {
          const geocodeResult = await getGeocodedResults(value);
          if (!geocodeResult) {
            return undefined;
          } else {
            const {
              results: [firstResult],
            } = geocodeResult;
            return {
              lat: `${firstResult.geometry.location.lat()}`,
              lng: `${firstResult.geometry.location.lng()}`,
              name: firstResult.formatted_address,
            };
          }
        } catch (e: any) {
          console.log(e);
          if (e.code === google.maps.GeocoderStatus.ZERO_RESULTS) {
            return undefined;
          } else {
            let title = "Failed to get geocoding results";
            if (e.code && statusCodes[e.code]) {
              title += `: ${statusCodes[e.code]}`;
            }
            notify({ title });
          }
        } finally {
          setLoading(false);
        }
      }, 400),
    [setLoading]
  );
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearch(value);
    const result = await debouncedGeocodeSearch(value);
    setResult(result);
  };

  const clearSearch = () => {
    setSearch("");
    setResult(undefined);
  };

  const noResultDisplay =
    !result && !loading ? (
      <div className="no-result-display">
        <img alt="Empty" className="image" src={emptyImg} />
        <Typography className="title" tag="h3" use="headline6">
          No results
        </Typography>
        <Typography className="subtitle" tag="p" use="body1">
          {search.length === 0 ? "Enter a query to get started." : "Make sure your query is spelt correctly."}
        </Typography>
      </div>
    ) : null;

  const resultDisplay = result ? (
    <div className="result-display">
      <div className="name-container">
        <Typography use="body1">{result.name}</Typography>
      </div>
      <div
        className="map-container"
        style={{
          backgroundImage: `url("${getStaticMapURL("368x368", theme, [
            {
              locations: [{ lat: result.lat, lng: result.lng }],
              styles: { color: `0x${pinColors[theme].green}` },
            },
          ])}")`,
        }}
      />
    </div>
  ) : null;

  const confirmResult = () => {
    if (result) {
      props.setLatLng({ lat: result.lat, lng: result.lng });
    }
    props.close();
    setTimeout(() => {
      setSearch("");
      setResult(undefined);
    }, 300);
  };

  return (
    <Drawer className="drawer-search drawer-right" modal onClose={props.close} open={props.open}>
      <DrawerHeader>
        <DrawerTitle>Location search</DrawerTitle>
        <Button disabled={!result} label="Confirm" onClick={confirmResult} outlined />
        <LinearProgress closed={!loading} />
      </DrawerHeader>
      <div className="search-container">
        <TextField
          icon="travel_explore"
          label="Search"
          name="query"
          onChange={handleChange}
          outlined
          trailingIcon={<IconButton icon="clear" onClick={clearSearch} />}
          value={search}
        />
      </div>
      <DrawerContent>
        <Typography className="subheader" tag="div" use="overline">
          Result
        </Typography>
        {noResultDisplay}
        {resultDisplay}
      </DrawerContent>
    </Drawer>
  );
};

export default DrawerSearch;
