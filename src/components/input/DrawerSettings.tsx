import React from "react";
import classNames from "classnames";
import { useAppDispatch, useAppSelector } from "@h";
import { getMonthData, getYearData } from "@s/data/functions";
import { initialState, inputSetQuery, selectLat, selectLng, selectMonth, selectYear, selectDateMode } from "@s/input";
import { selectQuery, selectLocation } from "@s/data";
import { selectLoading, selectTheme, toggleTheme } from "@s/display";
import { queryIcons } from "@s/util/constants";
import { hasKey } from "@s/util/functions";
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
import "./DrawerSettings.scss";
import { getStaticMapURL } from "@s/maps/functions";

const monthRegex = /^\d{4}-(0[1-9]|1[012])$/;
const latLngRegex = /^(-?\d+(\.\d+)?)$/;

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

type DrawerSettingsProps = {
  openSearch: () => void;
};

export const DrawerSettings = (props: DrawerSettingsProps) => {
  const theme = useAppSelector(selectTheme);
  const loading = useAppSelector(selectLoading);

  const dateMode = useAppSelector(selectDateMode);
  const month = useAppSelector(selectMonth);
  const year = useAppSelector(selectYear);
  const lat = useAppSelector(selectLat);
  const lng = useAppSelector(selectLng);

  const resultLocation = useAppSelector(selectLocation);
  const query = useAppSelector(selectQuery);

  const dispatch = useAppDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    if (hasKey(initialState.query, name)) {
      dispatch(inputSetQuery({ key: name, value: value }));
    }
  };

  const changeDateMode = (mode: "month" | "year") => {
    dispatch(inputSetQuery({ key: "dateMode", value: mode }));
  };
  const validDate = (dateMode === "month" && monthRegex.test(month)) || (dateMode === "year" && /^\d{4}$/.test(year));
  const validLocation = latLngRegex.test(lat) && latLngRegex.test(lng);
  const [resultLat, resultLng] = resultLocation.split(", ");
  const latLng = `${lat},${lng}`;
  const queryLocation = `${query.lat},${query.lng}`;
  const formFilled = validDate && validLocation;
  const submit = () => {
    if (formFilled) {
      if (dateMode === "month") {
        getMonthData({ type: dateMode, month, lat, lng });
      } else {
        getYearData({ type: dateMode, year, lat, lng });
      }
    }
  };

  const dateInput =
    dateMode === "month" ? (
      <TextField
        outlined
        label="Month"
        icon={queryIcons.month}
        name="month"
        required
        pattern="^\d{4}-(0[1-9]|1[012])$"
        value={month}
        onChange={handleChange}
        helpText={{ persistent: true, validationMsg: true, children: "Format: YYYY-MM" }}
      />
    ) : (
      <TextField
        outlined
        label="Year"
        icon={queryIcons.year}
        name="year"
        required
        pattern="^\d{4}$"
        value={year}
        onChange={handleChange}
        helpText={{ persistent: true, validationMsg: true, children: "Format: YYYY" }}
      />
    );

  return (
    <Drawer dismissible open className="drawer-settings">
      <DrawerHeader>
        <Logo className="drawer-logo" rotate={loading} />
        <div className="logo-text">CrimeScan</div>
        <IconButton icon={theme === "dark" ? "dark_mode" : "light_mode"} onClick={() => dispatch(toggleTheme())} />
        <LinearProgress closed={!loading} />
      </DrawerHeader>
      <DrawerContent>
        <div className="month-group">
          <Typography use="overline" tag="div" className="subheader">
            Date
          </Typography>
          <div className="segmented-button-container">
            <SegmentedButton toggle>
              <SegmentedButtonSegment
                label="Month"
                selected={dateMode === "month"}
                onClick={() => changeDateMode("month")}
              />
              <SegmentedButtonSegment
                label="Year"
                selected={dateMode === "year"}
                onClick={() => changeDateMode("year")}
              />
            </SegmentedButton>
          </div>
          {dateInput}
        </div>
        <div className="location-group">
          <Typography use="overline" tag="div" className="subheader">
            Location
          </Typography>
          <div className="button-container">
            <Button label="Search" icon="travel_explore" outlined onClick={props.openSearch} />
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
          <div className="guide-chips">
            {validLocation ? <Chip icon="location_on" label="Query" className="query-chip non-interactive" /> : null}
            {resultLocation && queryLocation === latLng ? (
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
                    backgroundImage: `url("${getStaticMapURL("448x448", theme, [
                      resultLocation && queryLocation === latLng
                        ? { color: pinColors[theme].red, lat: resultLat, lng: resultLng }
                        : false,
                      { color: pinColors[theme].green, lat, lng },
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
