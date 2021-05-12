import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { inputSet, selectLat, selectLng, selectMonth } from "./inputSlice";
import { selectLocation, selectQueryLocation } from "../display/dataSlice";
import classNames from "classnames";
import { iconObject } from "../../util/functions";
import { Button } from "@rmwc/button";
import { Chip } from "@rmwc/chip";
import { Drawer, DrawerHeader, DrawerContent } from "@rmwc/drawer";
import { Icon } from "@rmwc/icon";
import { IconButton } from "@rmwc/icon-button";
import { LinearProgress } from "@rmwc/linear-progress";
import { TextField } from "@rmwc/textfield";
import { Typography } from "@rmwc/Typography";
import { Logo } from "../util/Logo";
import "./DrawerSettings.scss";

const monthRegex = /^\d{4}-(0[1-9]|1[012])$/;
const latLngRegex = /^(-?\d+(\.\d+)?)$/;

const pinColors = {
  dark: {
    green: "AED581",
    red: "EF5350",
  },
  light: {
    green: "388E3C",
    red: "D32F2F",
  },
} as const;

type DrawerSettingsProps = {
  loading: boolean;
  getData: (month: string, lat: string, lng: string) => void;
};

export const DrawerSettings = (props: DrawerSettingsProps) => {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const changeTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.className = newTheme;
  };

  const month = useAppSelector(selectMonth);
  const lat = useAppSelector(selectLat);
  const lng = useAppSelector(selectLng);

  const resultLocation = useAppSelector(selectLocation);
  const queryLocation = useAppSelector(selectQueryLocation);

  const dispatch = useAppDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist();
    const name = e.target.name;
    const value = e.target.value;
    dispatch(inputSet({ key: name, value: value }));
  };
  const validLocation = latLngRegex.test(lat) && latLngRegex.test(lng);
  const latLng = `${lat},${lng}`;
  const formFilled = monthRegex.test(month) && latLngRegex.test(lat) && latLngRegex.test(lng);
  const submit = () => {
    if (formFilled) {
      props.getData(month, lat, lng);
    }
  };
  return (
    <Drawer dismissible open className="drawer-settings">
      <DrawerHeader>
        <Logo className="drawer-logo" rotate={props.loading} />
        <div className="logo-text">CrimeScan</div>
        <IconButton icon={theme === "dark" ? "dark_mode" : "light_mode"} onClick={changeTheme} />
        <LinearProgress closed={!props.loading} />
      </DrawerHeader>
      <DrawerContent>
        <div className="month-group">
          <Typography use="overline" tag="div" className="subheader">
            Date
          </Typography>
          <TextField
            outlined
            label="Month"
            icon="date_range"
            name="month"
            required
            pattern="^\d{4}-(0[1-9]|1[012])$"
            value={month}
            onChange={handleChange}
            helpText={{ persistent: true, validationMsg: true, children: "Format: YYYY-MM" }}
          />
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
                icon={iconObject(
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    version="1.1"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M12 4C15 4 17.5 5.6 18.9 8H5.1C6.5 5.6 9 4 12 4M12 20C9 20 6.5 18.4 5.1 16H18.9C17.5 18.4 15 20 12 20M4.3 14C4.1 13.4 4 12.7 4 12S4.1 10.6 4.3 10H19.8C20 10.6 20.1 11.3 20.1 12S20 13.4 19.8 14H4.3Z" />
                  </svg>
                )}
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
                icon={iconObject(
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    version="1.1"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2A10 10 0 1 0 22 12A10.03 10.03 0 0 0 12 2M9.4 19.6A8.05 8.05 0 0 1 9.4 4.4A16.45 16.45 0 0 0 7.5 12A16.45 16.45 0 0 0 9.4 19.6M12 20A13.81 13.81 0 0 1 9.5 12A13.81 13.81 0 0 1 12 4A13.81 13.81 0 0 1 14.5 12A13.81 13.81 0 0 1 12 20M14.6 19.6A16.15 16.15 0 0 0 14.6 4.4A8.03 8.03 0 0 1 20 12A7.9 7.9 0 0 1 14.6 19.6Z" />
                  </svg>
                )}
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
