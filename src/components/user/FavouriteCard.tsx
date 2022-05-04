import React, { useEffect, useState, ChangeEvent, useCallback } from "react";
import { EntityId } from "@reduxjs/toolkit";
import { Card, CardActionButton, CardActionButtons, CardActionIcon, CardActionIcons, CardActions } from "@rmwc/card";
import { TextField } from "@rmwc/textfield";
import { useAppDispatch, useAppSelector } from "@h";
import { removeFavourite, selectFavouriteByLatLng, updateFavourite } from "@s/user";
import { getStaticMapURL } from "@s/maps/functions";
import { selectTheme } from "@s/settings";
import { pinColors } from "@s/maps/constants";
import { withTooltip } from "@c/util/hocs";
import debounce from "lodash.debounce";
import { Typography } from "@rmwc/typography";
import { confirmDelete } from "/src/app/dialogQueue";
import "./FavouriteCard.scss";
import classNames from "classnames";

type FavouriteCardProps = {
  favouriteLatLng: EntityId;
  selected: boolean;
  applyLatLng: (latLngId: string) => void;
};

export const FavouriteCard = ({ favouriteLatLng, selected, applyLatLng }: FavouriteCardProps) => {
  const dispatch = useAppDispatch();

  const theme = useAppSelector(selectTheme);

  const favourite = useAppSelector((state) => selectFavouriteByLatLng(state, favouriteLatLng));
  if (!favourite) {
    return null;
  }
  const [name, setName] = useState(favourite.name);
  useEffect(() => {
    setName(favourite.name);
  }, [favourite.name]);
  const debouncedUpdate = useCallback(
    debounce((name) => dispatch(updateFavourite({ ...favourite, name })), 400),
    [favourite]
  );
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    debouncedUpdate(e.target.value);
  };
  const handleDelete = async () => {
    const confirmed = await confirmDelete({
      title: "Delete favourite",
      body: "Are you sure you want to delete this location?",
    });
    if (confirmed) {
      dispatch(removeFavourite(favouriteLatLng));
    }
  };
  return (
    <Card outlined className={classNames("favourite-card", { "favourite-card--selected": selected })}>
      <TextField outlined required label="Name" icon="location_on" value={name} onChange={handleChange} />
      <Typography use="overline">{`${favourite.lat}, ${favourite.lng}`}</Typography>
      <div
        className="map-container"
        style={{
          backgroundImage: `url("${getStaticMapURL("332x332", theme, [
            {
              styles: { color: `0x${pinColors[theme].green}` },
              locations: [{ lat: favourite.lat, lng: favourite.lng }],
            },
          ])}"`,
        }}
      />
      <CardActions>
        <CardActionButtons>
          <CardActionButton label="Apply" disabled={selected} onClick={() => applyLatLng(`${favouriteLatLng}`)} />
        </CardActionButtons>
        <CardActionIcons>
          {withTooltip(<CardActionIcon icon="delete" onClick={handleDelete} />, "Delete location", { align: "top" })}
        </CardActionIcons>
      </CardActions>
    </Card>
  );
};

export default FavouriteCard;
