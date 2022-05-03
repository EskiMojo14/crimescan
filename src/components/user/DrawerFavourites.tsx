import React from "react";
import useScrollLock from "@h/useScrollLock";
import { Drawer, DrawerHeader, DrawerTitle } from "@rmwc/drawer";
import "./DrawerFavourites.scss";

type DrawerFavouritesProps = {
  open: boolean;
  onClose: () => void;
};

export const DrawerFavourites = ({ open, onClose }: DrawerFavouritesProps) => {
  useScrollLock(open, "drawer-favourites");
  return (
    <Drawer {...{ open, onClose }} modal className="drawer-favourites drawer-right">
      <DrawerHeader>
        <DrawerTitle>Saved locations</DrawerTitle>
      </DrawerHeader>
    </Drawer>
  );
};

export default DrawerFavourites;
