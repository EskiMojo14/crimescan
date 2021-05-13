import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getMonthData, getYearData } from "../../app/getData";
import { initialState, inputSet, selectLat, selectLng, selectMonth, selectYear, selectDateMode } from "./inputSlice";
import { selectLocation, selectQuery } from "../display/dataSlice";
import { selectLoading, selectTheme, toggleTheme } from "../display/displaySlice";
import classNames from "classnames";
import { queryIcons } from "../../util/constants";
import { hasKey } from "../../util/functions";
import { Button } from "@rmwc/button";
import { Chip } from "@rmwc/chip";
import { Drawer, DrawerHeader, DrawerContent } from "@rmwc/drawer";
import { Icon } from "@rmwc/icon";
import { IconButton } from "@rmwc/icon-button";
import { LinearProgress } from "@rmwc/linear-progress";
import { TextField } from "@rmwc/textfield";
import { Typography } from "@rmwc/typography";
import { Logo } from "../util/Logo";
import { SegmentedButton, SegmentedButtonSegment } from "../util/SegmentedButton";
import "./DrawerSettings.scss";

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

export const DrawerSettings = () => {
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
    if (hasKey(initialState, name)) {
      dispatch(inputSet({ key: name, value: value }));
    }
  };

  const changeDateMode = (mode: "month" | "year") => {
    dispatch(inputSet({ key: "dateMode", value: mode }));
  };
  const validDate = (dateMode === "month" && monthRegex.test(month)) || (dateMode === "year" && /^\d{4}$/.test(year));
  const validLocation = latLngRegex.test(lat) && latLngRegex.test(lng);
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
                    backgroundImage: `url("https://maps.googleapis.com/maps/api/staticmap?size=448x448&key=${
                      process.env.GOOGLE_MAPS_KEY
                    }${
                      resultLocation && queryLocation === latLng
                        ? `&markers=color:0x${pinColors[theme].red}|${resultLocation}`
                        : ""
                    }&markers=color:0x${pinColors[theme].green}|${lat},${lng}")`,
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
