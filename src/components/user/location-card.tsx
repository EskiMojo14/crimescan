import React, { useEffect, useState, ChangeEvent, useCallback } from "react";
import { EntityId } from "@reduxjs/toolkit";
import { Card, CardActionButton, CardActionButtons, CardActionIcon, CardActionIcons, CardActions } from "@rmwc/card";
import { TextField } from "@rmwc/textfield";
import { useAppDispatch, useAppSelector } from "@h";
import { removeLocation, selectLocationByLatLng, updateLocation } from "@s/locations";
import { getStaticMapURL } from "@s/maps/functions";
import { selectTheme } from "@s/settings";
import { pinColors } from "@s/maps/constants";
import { withTooltip } from "@c/util/hocs";
import debounce from "lodash.debounce";
import { Typography } from "@rmwc/typography";
import { confirmDelete } from "/src/app/dialog-queue";
import "./location-card.scss";
import classNames from "classnames";

type LocationCardProps = {
  latLngId: EntityId;
  selected: boolean;
  applyLatLng: (latLngId: string) => void;
};

export const LocationCard = ({ latLngId, selected, applyLatLng }: LocationCardProps) => {
  const dispatch = useAppDispatch();

  const theme = useAppSelector(selectTheme);

  const location = useAppSelector((state) => selectLocationByLatLng(state, latLngId));
  if (!location) {
    return null;
  }
  const [name, setName] = useState(location.name);
  useEffect(() => {
    setName(location.name);
  }, [location.name]);
  const debouncedUpdate = useCallback(
    debounce((name) => dispatch(updateLocation({ ...location, name })), 400),
    [location]
  );
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    debouncedUpdate(e.target.value);
  };
  const handleDelete = async () => {
    const confirmed = await confirmDelete({
      title: "Delete location",
      body: "Are you sure you want to delete this location?",
    });
    if (confirmed) {
      dispatch(removeLocation(latLngId));
    }
  };
  return (
    <Card outlined className={classNames("location-card", { "location-card--selected": selected })}>
      <TextField outlined required label="Name" icon="location_on" value={name} onChange={handleChange} />
      <Typography use="overline">{`${location.lat}, ${location.lng}`}</Typography>
      <div
        className="map-container"
        style={{
          backgroundImage: `url("${getStaticMapURL("332x332", theme, [
            {
              styles: { color: `0x${pinColors[theme].green}` },
              locations: [{ lat: location.lat, lng: location.lng }],
            },
          ])}"`,
        }}
      />
      <CardActions>
        <CardActionButtons>
          <CardActionButton label="Apply" disabled={selected} onClick={() => applyLatLng(`${latLngId}`)} />
        </CardActionButtons>
        <CardActionIcons>
          {withTooltip(<CardActionIcon icon="delete" onClick={handleDelete} />, "Delete location", { align: "top" })}
        </CardActionIcons>
      </CardActions>
    </Card>
  );
};

export default LocationCard;
