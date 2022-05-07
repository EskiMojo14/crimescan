import type { ChangeEvent } from "react";
import { useMemo } from "react";
import { withTooltip } from "@c/util/hocs";
import { Logo } from "@c/util/logo";
import { SegmentedButton, SegmentedButtonSegment } from "@c/util/segmented-button";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { prompt } from "/src/app/dialog-queue";
import { Button } from "@rmwc/button";
import { Chip } from "@rmwc/chip";
import { Drawer, DrawerContent, DrawerHeader } from "@rmwc/drawer";
import { Icon } from "@rmwc/icon";
import { IconButton } from "@rmwc/icon-button";
import { LinearProgress } from "@rmwc/linear-progress";
import { TextField } from "@rmwc/textfield";
import { Typography } from "@rmwc/typography";
import { dateSchema, latLngRegex, latLngSchema, monthRegex, yearRegex } from "@s/data/schema";
import type { Query } from "@s/data/types";
import { pinColors } from "@s/maps/constants";
import type { UppercaseLetter } from "@s/maps/functions";
import { createLatLng, getStaticMapURL } from "@s/maps/functions";
import { queryIcons } from "@s/util/constants";
import { hasKey, iconObject } from "@s/util/functions";
import classNames from "classnames";
import { shallowEqual } from "react-redux";
import { useImmer } from "use-immer";
import { useAppDispatch, useAppSelector } from "@h";
import {
  dataApi,
  newQuery,
  selectFirstLocation,
  selectQuery,
  useGetMonthDataQuery,
  useGetYearDataQuery,
} from "@s/data";
import { addLocation, selectLocationByLatLng, selectLocationTotal } from "@s/locations";
import { selectTheme, toggleTheme } from "@s/settings";
import "./drawer-query.scss";

type DrawerQueryProps = {
  latLng: { lat: string; lng: string };
  openLocations: () => void;
  openSearch: () => void;
  setLatLng: (latLng: { lat: string; lng: string }) => void;
};

export const DrawerQuery = ({ latLng: { lat, lng }, openLocations, openSearch, setLatLng }: DrawerQueryProps) => {
  const dispatch = useAppDispatch();

  const theme = useAppSelector(selectTheme);

  const locationTotal = useAppSelector(selectLocationTotal);

  const [inputQuery, updateInputQuery] = useImmer<Omit<Query, "lat" | "lng">>({
    date: "",
    type: "month",
  });

  const { date, type } = inputQuery;

  const latLngString = createLatLng({ lat, lng });

  const { monthError } = dataApi.endpoints.getMonthData.useQueryState(
    type !== "month" ? skipToken : { date, lat, lng, type },
    { selectFromResult: ({ isError }) => ({ monthError: isError }) }
  );

  const { yearError } = dataApi.endpoints.getYearData.useQueryState(
    type !== "year" ? skipToken : { date, lat, lng, type },
    { selectFromResult: ({ isError }) => ({ yearError: isError }) }
  );

  const savedLocation = useAppSelector((state) => selectLocationByLatLng(state, latLngString));

  const query = useAppSelector(selectQuery);

  const { monthDataFetching, monthLocation } = useGetMonthDataQuery(
    !query || query.type !== "month" ? skipToken : query,
    {
      selectFromResult: ({ data, isFetching }) => ({
        monthDataFetching: isFetching,
        monthLocation: selectFirstLocation(data),
      }),
    }
  );
  const { yearDataFetching, yearLocation } = useGetYearDataQuery(!query || query.type !== "year" ? skipToken : query, {
    selectFromResult: ({ data, isFetching }) => ({
      yearDataFetching: isFetching,
      yearLocation: selectFirstLocation(data),
    }),
  });

  const resultLocation = monthLocation ?? yearLocation;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (hasKey(inputQuery, name) && name !== "type") {
      updateInputQuery((draftQuery) => {
        draftQuery[name] = value;
      });
    } else if (name === "lat" || name === "lng") {
      setLatLng({ lat, lng, [name]: value });
    }
  };

  const handleSave = async () => {
    const name = await prompt({ acceptLabel: "Save", inputProps: { outlined: true }, title: "Location name" });
    if (name) {
      dispatch(addLocation({ lat, lng, name }));
    }
  };

  const changeType = (mode: "month" | "year") =>
    updateInputQuery((draftQuery) => {
      draftQuery.type = mode;
    });

  const validDate = useMemo(() => dateSchema.safeParse({ date, type }).success, [type, date]);
  const validLocation = useMemo(() => latLngSchema.safeParse({ lat, lng }).success, [lat, lng]);
  const formFilled =
    validDate &&
    validLocation &&
    !shallowEqual({ date, lat, lng }, { date: query?.date, lat: query?.lat, lng: query?.lng });

  const submit = () => {
    if (formFilled) {
      dispatch(newQuery({ ...inputQuery, lat, lng }));
    }
  };

  const loading = monthDataFetching || yearDataFetching;

  return (
    <Drawer className="drawer-settings" dismissible open>
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
          <Typography className="subheader" tag="div" use="overline">
            Date
          </Typography>
          <div className="segmented-button-container">
            <SegmentedButton toggle>
              <SegmentedButtonSegment label="Month" onClick={() => changeType("month")} selected={type === "month"} />
              <SegmentedButtonSegment label="Year" onClick={() => changeType("year")} selected={type === "year"} />
            </SegmentedButton>
          </div>
          <TextField
            helpText={{
              children: `Format: ${type === "month" ? "YYYY-MM" : "YYYY"}`,
              persistent: true,
              validationMsg: true,
            }}
            icon={type === "month" ? queryIcons.month : queryIcons.year}
            label={type === "month" ? "Month" : "Year"}
            name="date"
            onChange={handleChange}
            outlined
            pattern={type === "month" ? monthRegex.source : yearRegex.source}
            required
            value={date}
          />
        </div>
        <div className="location-group">
          <Typography className="subheader" tag="div" use="overline">
            Location
          </Typography>
          <div className="button-container">
            <Button icon="travel_explore" label="Search" onClick={openSearch} outlined />
            <Button
              disabled={!locationTotal}
              icon={iconObject(
                <svg viewBox="0 0 24 24">
                  <path
                    d="M11.5 9C11.5 7.62 12.62 6.5 14 6.5C15.1 6.5 16.03 7.21 16.37 8.19C16.45 8.45 16.5 8.72 16.5 9C16.5 10.38 15.38 11.5 14 11.5C12.91 11.5 12 10.81 11.64 9.84C11.55 9.58 11.5 9.29 11.5 9M5 9C5 13.5 10.08 19.66 11 20.81L10 22C10 22 3 14.25 3 9C3 5.83 5.11 3.15 8 2.29C6.16 3.94 5 6.33 5 9M14 2C17.86 2 21 5.13 21 9C21 14.25 14 22 14 22C14 22 7 14.25 7 9C7 5.13 10.14 2 14 2M14 4C11.24 4 9 6.24 9 9C9 10 9 12 14 18.71C19 12 19 10 19 9C19 6.24 16.76 4 14 4Z"
                    fill="currentColor"
                  />
                </svg>
              )}
              label="Saved"
              onClick={openLocations}
              outlined
            />
          </div>
          <div className="double-field">
            <div className="field">
              <TextField
                helpText={{
                  children: lat.length > 0 && !latLngRegex.test(lat) ? "Invalid format" : "This field is required",
                  persistent: false,
                  validationMsg: true,
                }}
                icon={queryIcons.lat}
                label="Latitude"
                name="lat"
                onChange={handleChange}
                outlined
                pattern="^(-?\d+(\.\d+)?)$"
                required
                value={lat}
              />
            </div>
            <div className="field">
              <TextField
                helpText={{
                  children: lng.length > 0 && !latLngRegex.test(lng) ? "Invalid format" : "This field is required",
                  persistent: false,
                  validationMsg: true,
                }}
                icon={queryIcons.lng}
                label="Longitude"
                name="lng"
                onChange={handleChange}
                outlined
                pattern="^(-?\d+(\.\d+)?)$"
                required
                value={lng}
              />
            </div>
          </div>
          <div className="button-container">
            <Button
              disabled={!validLocation || !!savedLocation}
              icon={iconObject(
                <svg viewBox="0 0 24 24">
                  <path
                    d="M12 2C15.9 2 19 5.1 19 9C19 14.2 12 22 12 22S5 14.2 5 9C5 5.1 8.1 2 12 2M12 4C9.2 4 7 6.2 7 9C7 10 7 12 12 18.7C17 12 17 10 17 9C17 6.2 14.8 4 12 4M12 11.5L14.4 13L13.8 10.2L16 8.3L13.1 8.1L12 5.4L10.9 8L8 8.3L10.2 10.2L9.5 13L12 11.5Z"
                    fill="currentColor"
                  />
                </svg>
              )}
              label="Save"
              onClick={handleSave}
              outlined
            />
          </div>
          <div className="guide-chips">
            {validLocation ? (
              <Chip className="query-chip non-interactive" icon="location_on" label={savedLocation?.name ?? "Query"} />
            ) : null}
            {query && resultLocation && createLatLng(query) === latLngString ? (
              <Chip
                className="result-chip non-interactive"
                icon="location_on"
                label={
                  <>
                    <a href="https://data.police.uk/about/#location-anonymisation" rel="noreferrer" target="_blank">
                      Approximate
                    </a>{" "}
                    location
                  </>
                }
              />
            ) : null}
          </div>
          <div
            className={classNames("map-container", { image: validLocation })}
            style={
              validLocation
                ? {
                    backgroundImage: `url("${getStaticMapURL("438x438", theme, [
                      resultLocation && query && createLatLng(query) === latLngString
                        ? {
                            locations: [resultLocation],
                            styles: { color: `0x${pinColors[theme].red}`, label: "A" },
                          }
                        : false,
                      {
                        locations: [{ lat, lng }],
                        styles: {
                          color: `0x${pinColors[theme].green}`,
                          label: savedLocation?.name.toLocaleUpperCase().charAt(0) as UppercaseLetter | undefined,
                        },
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
              <a href="https://data.police.uk/" rel="noreferrer" target="_blank">
                https://data.police.uk/
              </a>
              . Note that crime levels in Scotland may appear much lower than true values, as only the British Transport
              Police provide data for Scotland.
            </Typography>
          </div>
        </div>
      </DrawerContent>
      <div className="submit-button">
        <Button
          className={classNames({ delete: monthError || yearError })}
          disabled={!formFilled}
          label="submit"
          onClick={submit}
          outlined
        />
      </div>
    </Drawer>
  );
};

export default DrawerQuery;
