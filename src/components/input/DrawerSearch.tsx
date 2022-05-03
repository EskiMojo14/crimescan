import React, { useMemo, useState } from "react";
import classNames from "classnames";
import { useAppSelector } from "@h";
import { getGeocodedResults, getStaticMapURL } from "@s/maps/functions";
import { notify } from "/src/app/snackbarQueue";
import { statusCodes } from "/src/app/slices/maps/constants";
import { asyncDebounce } from "/src/app/slices/util/functions";
import { MapResult } from "/src/app/slices/maps/types";
import { selectTheme } from "@s/display";
import { Button } from "@rmwc/button";
import { Drawer, DrawerHeader, DrawerContent, DrawerTitle } from "@rmwc/drawer";
import { IconButton } from "@rmwc/icon-button";
import { Icon } from "@rmwc/icon";
import { LinearProgress } from "@rmwc/linear-progress";
import { TextField } from "@rmwc/textfield";
import { Typography } from "@rmwc/typography";
import "./DrawerSearch.scss";
import emptyImg from "@m/empty.svg";

const pinColors = {
  dark: {
    green: "AED581",
    red: "EF5350",
  },
  light: {
    green: "689F38",
    red: "D32F2F",
  },
} as const;

type DrawerSearchProps = {
  open: boolean;
  close: () => void;
  setLatLng: (latLng: { lat: string; lng: string }) => void;
};

export const DrawerSearch = (props: DrawerSearchProps) => {
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
              name: firstResult.formatted_address,
              lat: `${firstResult.geometry.location.lat()}`,
              lng: `${firstResult.geometry.location.lng()}`,
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
        <img className="image" src={emptyImg} alt="Empty" />
        <Typography className="title" use="headline6" tag="h3">
          No results
        </Typography>
        <Typography className="subtitle" use="body1" tag="p">
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
        className="map-container image"
        style={{
          backgroundImage: `url("${getStaticMapURL("368x368", theme, [
            {
              styles: { color: `0x${pinColors[theme].green}` },
              locations: [{ lat: result.lat, lng: result.lng }],
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
    <Drawer open={props.open} onClose={props.close} modal className="drawer-search drawer-right">
      <DrawerHeader>
        <DrawerTitle>Location search</DrawerTitle>
        <Button label="Confirm" outlined onClick={confirmResult} disabled={!result} />
        <LinearProgress closed={!loading} />
      </DrawerHeader>
      <div className="search-container">
        <TextField
          label="Search"
          icon="travel_explore"
          outlined
          name="query"
          value={search}
          onChange={handleChange}
          trailingIcon={<IconButton icon="clear" onClick={clearSearch} />}
        />
      </div>
      <DrawerContent>
        <Typography use="overline" className="subheader" tag="div">
          Result
        </Typography>
        {noResultDisplay}
        {resultDisplay}
      </DrawerContent>
    </Drawer>
  );
};
