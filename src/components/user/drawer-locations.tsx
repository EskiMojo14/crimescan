import React from "react";
import useScrollLock from "@h/use-scroll-lock";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@rmwc/drawer";
import { useAppSelector } from "@h";
import { createLatLng } from "@s/maps/functions";
import { selectLocationLatLngs } from "@s/locations";
import LocationCard from "@c/user/location-card";
import { Typography } from "@rmwc/typography";
import emptyImg from "@m/empty.svg";
import "./drawer-locations.scss";

type DrawerLocationsProps = {
  open: boolean;
  onClose: () => void;
  latLng: { lat: string; lng: string };
  setLatLng: (latLng: { lat: string; lng: string }) => void;
};

export const DrawerLocations = ({ open, onClose, latLng, setLatLng }: DrawerLocationsProps) => {
  useScrollLock(open, "drawer-favourites");
  const locationLatLngs = useAppSelector(selectLocationLatLngs);
  const applyLatLng = (latLngId: string) => {
    const [lat, lng] = latLngId.split(",");
    setLatLng({ lat, lng });
  };
  return (
    <Drawer {...{ open, onClose }} modal className="drawer-favourites drawer-right">
      <DrawerHeader>
        <DrawerTitle>Saved locations</DrawerTitle>
      </DrawerHeader>
      <DrawerContent>
        {locationLatLngs.length ? (
          locationLatLngs.map((latLngId) => (
            <LocationCard
              key={latLngId}
              latLngId={latLngId}
              selected={latLngId === createLatLng(latLng)}
              applyLatLng={applyLatLng}
            />
          ))
        ) : (
          <div className="no-result-display">
            <img className="image" src={emptyImg} alt="Empty" />
            <Typography className="title" use="headline6" tag="h3">
              No locations saved
            </Typography>
            <Typography className="subtitle" use="body1" tag="p">
              Add some using the query drawer!
            </Typography>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default DrawerLocations;
