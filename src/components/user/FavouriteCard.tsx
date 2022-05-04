import React, { useEffect, useState, ChangeEvent, useCallback } from "react";
import { EntityId } from "@reduxjs/toolkit";
import { Card, CardActionIcon, CardActionIcons, CardActions } from "@rmwc/card";
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

type FavouriteCardProps = {
  favouriteLatLng: EntityId;
};

export const FavouriteCard = ({ favouriteLatLng }: FavouriteCardProps) => {
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
    <Card outlined className="favourite-card">
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
        <CardActionIcons>
          {withTooltip(<CardActionIcon icon="delete" onClick={handleDelete} />, "Delete location", { align: "top" })}
        </CardActionIcons>
      </CardActions>
    </Card>
  );
};

export default FavouriteCard;
