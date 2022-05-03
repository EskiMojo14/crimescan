import React, { useEffect } from "react";
import classNames from "classnames";
import { useImmer } from "use-immer";
import { useAppDispatch, useAppSelector } from "@h";
import { getStaticMapURL } from "@s/maps/functions";
import { notify } from "/src/app/snackbarQueue";
import { selectLoading, selectQuery, selectLocation, getMonthData, getYearData } from "@s/data";
import { selectTheme, toggleTheme } from "@s/settings";
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
import "./DrawerQuery.scss";

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

type DrawerQueryProps = {
  openSearch: () => void;
  latLng: { lat: string; lng: string };
};

type InputState = {
  dateMode: "month" | "year";
  month: string;
  year: string;
  lat: string;
  lng: string;
};

export const DrawerQuery = (props: DrawerQueryProps) => {
  const dispatch = useAppDispatch();

  const theme = useAppSelector(selectTheme);
  const loading = useAppSelector(selectLoading);

  const [inputState, updateInputState] = useImmer<InputState>({
    dateMode: "month",
    month: "",
    year: "",
    lat: "",
    lng: "",
  });

  useEffect(() => {
    updateInputState((draftState) => {
      Object.assign(draftState, props.latLng);
    });
  }, [props.latLng]);

  const { dateMode, month, year, lat, lng } = inputState;

  const resultLocation = useAppSelector(selectLocation);
  const query = useAppSelector(selectQuery);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    if (hasKey(inputState, name) && name !== "dateMode") {
      updateInputState((draftState) => {
        draftState[name] = value;
      });
    }
  };

  const changeDateMode = (mode: "month" | "year") =>
    updateInputState((draftState) => {
      draftState.dateMode = mode;
    });
  const validDate = (dateMode === "month" && monthRegex.test(month)) || (dateMode === "year" && /^\d{4}$/.test(year));
  const validLocation = latLngRegex.test(lat) && latLngRegex.test(lng);
  const { lat: resultLat, lng: resultLng } = resultLocation ?? {};
  const latLng = `${lat},${lng}`;
  const formFilled = validDate && validLocation;
  const submit = async () => {
    if (formFilled) {
      try {
        if (dateMode === "month") {
          await dispatch(getMonthData({ type: dateMode, date: month, lat, lng })).unwrap();
        } else {
          await dispatch(getYearData({ type: dateMode, date: year, lat, lng })).unwrap();
        }
      } catch (e) {
        console.log(e);
        notify({ title: "Failed to get crime data" });
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
            <Button label="Saved" icon="star" outlined />
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
            {resultLocation && `${query?.lat},${query?.lng}` === latLng ? (
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
                      resultLat && resultLng && `${query?.lat},${query?.lng}` === latLng
                        ? {
                            styles: { color: `0x${pinColors[theme].red}` },
                            locations: [{ lat: resultLat, lng: resultLng }],
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
