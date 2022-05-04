import React from "react";
import useScrollLock from "@h/useScrollLock";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@rmwc/drawer";
import { useAppSelector } from "@h";
import { selectFavouriteLatLngs } from "@s/user";
import FavouriteCard from "@c/user/FavouriteCard";
import "./DrawerFavourites.scss";

type DrawerFavouritesProps = {
  open: boolean;
  onClose: () => void;
  latLng: { lat: string; lng: string };
  setLatLng: (latLng: { lat: string; lng: string }) => void;
};

export const DrawerFavourites = ({ open, onClose, latLng, setLatLng }: DrawerFavouritesProps) => {
  useScrollLock(open, "drawer-favourites");
  const favouriteLatLngs = useAppSelector(selectFavouriteLatLngs);
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
        {favouriteLatLngs.map((latLngId) => (
          <FavouriteCard
            key={latLngId}
            favouriteLatLng={latLngId}
            selected={latLngId === `${latLng.lat},${latLng.lng}`}
            applyLatLng={applyLatLng}
          />
        ))}
      </DrawerContent>
    </Drawer>
  );
};

export default DrawerFavourites;
