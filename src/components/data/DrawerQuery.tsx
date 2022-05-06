import React, { useEffect, useMemo } from "react";
import { skipToken } from "@reduxjs/toolkit/query/react";
import classNames from "classnames";
import { shallowEqual } from "react-redux";
import { useImmer } from "use-immer";
import { useAppDispatch, useAppSelector } from "@h";
import { createLatLng, getStaticMapURL } from "@s/maps/functions";
import { prompt } from "/src/app/dialogQueue";
import { selectQuery, useGetMonthDataQuery, useGetYearDataQuery, newQuery, selectFirstLocation } from "@s/data";
import { dateSchema, latLngRegex, latLngSchema, monthRegex, yearRegex } from "@s/data/schema";
import { Query } from "@s/data/types";
import { pinColors } from "@s/maps/constants";
import { selectTheme, toggleTheme } from "@s/settings";
import { queryIcons } from "@s/util/constants";
import { hasKey, iconObject } from "@s/util/functions";
import { Button } from "@rmwc/button";
import { Chip } from "@rmwc/chip";
import { Drawer, DrawerHeader, DrawerContent } from "@rmwc/drawer";
import { Icon } from "@rmwc/icon";
import { IconButton } from "@rmwc/icon-button";
import { LinearProgress } from "@rmwc/linear-progress";
import { TextField } from "@rmwc/textfield";
import { Typography } from "@rmwc/typography";
import { Logo } from "@c/util/Logo";
import { SegmentedButton, SegmentedButtonSegment } from "@c/util/SegmentedButton";
import { withTooltip } from "@c/util/hocs";
import { addLocation, selectLocationMap, selectLocationTotal } from "@s/locations";
import "./DrawerQuery.scss";

type DrawerQueryProps = {
  openLocations: () => void;
  openSearch: () => void;
  latLng: { lat: string; lng: string };
};

export const DrawerQuery = (props: DrawerQueryProps) => {
  const dispatch = useAppDispatch();

  const theme = useAppSelector(selectTheme);

  const locationsMap = useAppSelector(selectLocationMap);
  const locationTotal = useAppSelector(selectLocationTotal);

  const [inputQuery, updateInputQuery] = useImmer<Query>({
    type: "month",
    date: "",
    lat: "",
    lng: "",
  });

  useEffect(() => {
    updateInputQuery((draftQuery) => {
      Object.assign(draftQuery, props.latLng);
    });
  }, [props.latLng]);

  const { type, date, lat, lng } = inputQuery;

  const query = useAppSelector(selectQuery);

  const { monthLocation, monthDataFetching } = useGetMonthDataQuery(
    !query || query.type !== "month" ? skipToken : query,
    {
      selectFromResult: ({ data, isFetching: monthDataFetching }) => ({
        monthLocation: selectFirstLocation(data),
        monthDataFetching,
      }),
    }
  );
  const { yearLocation, yearDataFetching } = useGetYearDataQuery(!query || query.type !== "year" ? skipToken : query, {
    selectFromResult: ({ data, isFetching: yearDataFetching }) => ({
      yearLocation: selectFirstLocation(data),
      yearDataFetching,
    }),
  });

  const resultLocation = monthLocation ?? yearLocation;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    if (hasKey(inputQuery, name) && name !== "type") {
      updateInputQuery((draftQuery) => {
        draftQuery[name] = value;
      });
    }
  };

  const handleSave = async () => {
    const name = await prompt({ title: "Location name", acceptLabel: "Save", inputProps: { outlined: true } });
    if (name) {
      dispatch(addLocation({ name, lat, lng }));
    }
  };

  const changeType = (mode: "month" | "year") =>
    updateInputQuery((draftQuery) => {
      draftQuery.type = mode;
    });

  const validDate = useMemo(() => dateSchema.safeParse({ type, date }).success, [type, date]);
  const validLocation = useMemo(() => latLngSchema.safeParse({ lat, lng }).success, [lat, lng]);

  const latLng = createLatLng({ lat, lng });
  const formFilled =
    validDate &&
    validLocation &&
    !shallowEqual({ lat, lng, date }, { lat: query?.lat, lng: query?.lng, date: query?.date });

  const submit = () => {
    if (formFilled) {
      dispatch(newQuery(inputQuery));
    }
  };

  const loading = monthDataFetching || yearDataFetching;

  return (
    <Drawer dismissible open className="drawer-settings">
      <DrawerHeader>
        <Logo className="drawer-logo" rotate={loading} />
        <div className="logo-text">CrimeScan</div>
        {withTooltip(
          <IconButton icon={theme === "dark" ? "dark_mode" : "light_mode"} onClick={() => dispatch(toggleTheme())} />,
          "Toggle theme",
          { align: "bottom" }
        )}
        <LinearProgress closed={!loading} />
      </DrawerHeader>
      <DrawerContent>
        <div className="month-group">
          <Typography use="overline" tag="div" className="subheader">
            Date
          </Typography>
          <div className="segmented-button-container">
            <SegmentedButton toggle>
              <SegmentedButtonSegment label="Month" selected={type === "month"} onClick={() => changeType("month")} />
              <SegmentedButtonSegment label="Year" selected={type === "year"} onClick={() => changeType("year")} />
            </SegmentedButton>
          </div>
          <TextField
            outlined
            label={type === "month" ? "Month" : "Year"}
            icon={type === "month" ? queryIcons.month : queryIcons.year}
            name="date"
            required
            pattern={type === "month" ? monthRegex.source : yearRegex.source}
            value={date}
            onChange={handleChange}
            helpText={{
              persistent: true,
              validationMsg: true,
              children: `Format: ${type === "month" ? "YYYY-MM" : "YYYY"}`,
            }}
          />
        </div>
        <div className="location-group">
          <Typography use="overline" tag="div" className="subheader">
            Location
          </Typography>
          <div className="button-container">
            <Button label="Search" icon="travel_explore" outlined onClick={props.openSearch} />
            <Button
              label="Saved"
              icon={iconObject(
                <svg viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M11.5 9C11.5 7.62 12.62 6.5 14 6.5C15.1 6.5 16.03 7.21 16.37 8.19C16.45 8.45 16.5 8.72 16.5 9C16.5 10.38 15.38 11.5 14 11.5C12.91 11.5 12 10.81 11.64 9.84C11.55 9.58 11.5 9.29 11.5 9M5 9C5 13.5 10.08 19.66 11 20.81L10 22C10 22 3 14.25 3 9C3 5.83 5.11 3.15 8 2.29C6.16 3.94 5 6.33 5 9M14 2C17.86 2 21 5.13 21 9C21 14.25 14 22 14 22C14 22 7 14.25 7 9C7 5.13 10.14 2 14 2M14 4C11.24 4 9 6.24 9 9C9 10 9 12 14 18.71C19 12 19 10 19 9C19 6.24 16.76 4 14 4Z"
                  />
                </svg>
              )}
              outlined
              disabled={!locationTotal}
              onClick={props.openLocations}
            />
          </div>
          <div className="double-field">
            <div className="field">
              <TextField
                outlined
                label="Latitude"
                icon={queryIcons.lat}
                name="lat"
                required
                pattern="^(-?\d+(\.\d+)?)$"
                value={lat}
                onChange={handleChange}
                helpText={{
                  persistent: false,
                  validationMsg: true,
                  children: lat.length > 0 && !latLngRegex.test(lat) ? "Invalid format" : "This field is required",
                }}
              />
            </div>
            <div className="field">
              <TextField
                outlined
                label="Longitude"
                icon={queryIcons.lng}
                name="lng"
                required
                pattern="^(-?\d+(\.\d+)?)$"
                value={lng}
                onChange={handleChange}
                helpText={{
                  persistent: false,
                  validationMsg: true,
                  children: lng.length > 0 && !latLngRegex.test(lng) ? "Invalid format" : "This field is required",
                }}
              />
            </div>
          </div>
          <div className="button-container">
            <Button
              label="Save"
              icon={iconObject(
                <svg viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12 2C15.9 2 19 5.1 19 9C19 14.2 12 22 12 22S5 14.2 5 9C5 5.1 8.1 2 12 2M12 4C9.2 4 7 6.2 7 9C7 10 7 12 12 18.7C17 12 17 10 17 9C17 6.2 14.8 4 12 4M12 11.5L14.4 13L13.8 10.2L16 8.3L13.1 8.1L12 5.4L10.9 8L8 8.3L10.2 10.2L9.5 13L12 11.5Z"
                  />
                </svg>
              )}
              outlined
              onClick={handleSave}
              disabled={!validLocation || latLng in locationsMap}
            />
          </div>
          <div className="guide-chips">
            {validLocation ? <Chip icon="location_on" label="Query" className="query-chip non-interactive" /> : null}
            {query && resultLocation && createLatLng(query) === latLng ? (
              <Chip
                icon="location_on"
                label={
                  <>
                    <a href="https://data.police.uk/about/#location-anonymisation" target="_blank" rel="noreferrer">
                      Approximate
                    </a>{" "}
                    location
                  </>
                }
                className="result-chip non-interactive"
              />
            ) : null}
          </div>
          <div
            className={classNames("map-container", { image: validLocation })}
            style={
              validLocation
                ? {
                    backgroundImage: `url("${getStaticMapURL("438x438", theme, [
                      resultLocation && query && createLatLng(query) === latLng
                        ? {
                            styles: { color: `0x${pinColors[theme].red}` },
                            locations: [resultLocation],
                          }
                        : false,
                      {
                        styles: { color: `0x${pinColors[theme].green}` },
                        locations: [{ lat, lng }],
                      },
                    ])}")`,
                  }
                : undefined
            }
          >
            <div className="map-icon">
              <Icon icon={{ icon: "map", size: "large" }} />
            </div>
          </div>
          <div className="disclaimer-container">
            <Typography use="caption">
              Information provided by{" "}
              <a href="https://data.police.uk/" target="_blank" rel="noreferrer">
                https://data.police.uk/
              </a>
              . Note that crime levels in Scotland may appear much lower than true values, as only the British Transport
              Police provide data for Scotland.
            </Typography>
          </div>
        </div>
      </DrawerContent>
      <div className="submit-button">
        <Button label="submit" outlined disabled={!formFilled} onClick={submit} />
      </div>
    </Drawer>
  );
};

export default DrawerQuery;
