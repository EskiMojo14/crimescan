import type { ChangeEvent } from "react";
import { useCallback, useEffect, useState } from "react";
import type { EntityId } from "@reduxjs/toolkit";
import { Card, CardActionButton, CardActionButtons, CardActionIcon, CardActionIcons, CardActions } from "@rmwc/card";
import { TextField } from "@rmwc/textfield";
import { Typography } from "@rmwc/typography";
import classNames from "classnames";
import debounce from "lodash.debounce";
import { withTooltip } from "@c/util/hocs";
import { useAppDispatch, useAppSelector } from "@h";
import { removeLocation, selectLocationByLatLng, updateLocation } from "@s/locations";
import { pinColors } from "@s/maps/constants";
import { getStaticMapURL } from "@s/maps/functions";
import type { UppercaseLetter } from "@s/maps/functions";
import { selectTheme } from "@s/settings";
import { confirmDelete } from "/src/app/dialog-queue";

type LocationCardProps = {
  applyLatLng: (latLngId: string) => void;
  latLngId: EntityId;
  selected: boolean;
};

export const LocationCard = ({ applyLatLng, latLngId, selected }: LocationCardProps) => {
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
      body: "Are you sure you want to delete this location?",
      title: "Delete location",
    });
    if (confirmed) {
      dispatch(removeLocation(latLngId));
    }
  };
  return (
    <Card className={classNames("location-card", { "location-card--selected": selected })} outlined>
      <TextField icon="location_on" label="Name" onChange={handleChange} outlined required value={name} />
      <Typography use="overline">{`${location.lat}, ${location.lng}`}</Typography>
      <div
        className="map-container"
        style={{
          backgroundImage: `url("${getStaticMapURL("332x332", theme, [
            {
              locations: [{ lat: location.lat, lng: location.lng }],
              styles: {
                color: `0x${pinColors[theme].green}`,
                label: location.name.toLocaleUpperCase().charAt(0) as UppercaseLetter,
              },
            },
          ])}"`,
        }}
      />
      <CardActions>
        <CardActionButtons>
          <CardActionButton disabled={selected} label="Apply" onClick={() => applyLatLng(`${latLngId}`)} />
        </CardActionButtons>
        <CardActionIcons>
          {withTooltip(<CardActionIcon icon="delete" onClick={handleDelete} />, "Delete location", { align: "top" })}
        </CardActionIcons>
      </CardActions>
    </Card>
  );
};

export default LocationCard;
