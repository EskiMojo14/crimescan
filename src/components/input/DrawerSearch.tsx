import React from "react";
import classNames from "classnames";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { geocodeSearch } from "../../app/googleMaps";
import { initialState, inputSetSearch, selectSearchQuery, setLatLng } from "../../app/slices/input";
import { selectMapsLoading, selectMapsNoResults, selectMapsResult, setNoResults } from "../../app/slices/maps";
import { selectTheme } from "../../app/slices/display";
import { hasKey } from "../../util/functions";
import { Button } from "@rmwc/button";
import { Drawer, DrawerHeader, DrawerContent, DrawerTitle } from "@rmwc/drawer";
import { IconButton } from "@rmwc/icon-button";
import { Icon } from "@rmwc/icon";
import { LinearProgress } from "@rmwc/linear-progress";
import { TextField } from "@rmwc/textfield";
import { Typography } from "@rmwc/typography";
import "./DrawerSearch.scss";
import emptyImg from "../../media/empty.svg";

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
};

export const DrawerSearch = (props: DrawerSearchProps) => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);

  const search = useAppSelector(selectSearchQuery);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    if (hasKey(initialState.search, name)) {
      dispatch(inputSetSearch({ key: name, value: value }));
      if (name === "query") {
        geocodeSearch(value);
      }
    }
  };
  const clearSearch = () => {
    dispatch(inputSetSearch({ key: "query", value: "" }));
    dispatch(setNoResults(true));
  };

  const loading = useAppSelector(selectMapsLoading);
  const noResults = useAppSelector(selectMapsNoResults);
  const result = useAppSelector(selectMapsResult);

  const noResultDisplay =
    noResults && !loading ? (
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
  const validLocation = result.lat && result.lng;
  const resultDisplay = !noResults ? (
    <div className="result-display">
      <div className="name-container">
        <Typography use="body1">{result.name}</Typography>
      </div>
      <div
        className={classNames("map-container", { image: validLocation })}
        style={
          validLocation
            ? {
                backgroundImage: `url("https://maps.googleapis.com/maps/api/staticmap?size=448x448&key=${process.env.GOOGLE_MAPS_KEY}&markers=color:0x${pinColors[theme].green}|${result.lat},${result.lng}")`,
              }
            : undefined
        }
      >
        <div className="map-icon">
          <Icon icon={{ icon: "map", size: "large" }} />
        </div>
      </div>
    </div>
  ) : null;

  const confirmResult = () => {
    dispatch(setLatLng({ lat: result.lat, lng: result.lng }));
    props.close();
    setTimeout(() => {
      dispatch(inputSetSearch({ key: "query", value: "" }));
      dispatch(setNoResults(true));
    }, 300);
  };

  return (
    <Drawer open={props.open} onClose={props.close} modal className="drawer-search drawer-right">
      <DrawerHeader>
        <DrawerTitle>Location search</DrawerTitle>
        <Button label="Confirm" outlined onClick={confirmResult} disabled={noResults} />
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
