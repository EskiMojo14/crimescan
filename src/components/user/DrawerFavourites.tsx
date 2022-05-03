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
};

export const DrawerFavourites = ({ open, onClose }: DrawerFavouritesProps) => {
  useScrollLock(open, "drawer-favourites");
  const favouriteLatLngs = useAppSelector(selectFavouriteLatLngs);
  return (
    <Drawer {...{ open, onClose }} modal className="drawer-favourites drawer-right">
      <DrawerHeader>
        <DrawerTitle>Saved locations</DrawerTitle>
      </DrawerHeader>
      <DrawerContent>
        {favouriteLatLngs.map((latLng) => (
          <FavouriteCard key={latLng} favouriteLatLng={latLng} />
        ))}
      </DrawerContent>
    </Drawer>
  );
};

export default DrawerFavourites;
