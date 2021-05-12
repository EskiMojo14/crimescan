import React from "react";
import { Drawer, DrawerHeader, DrawerContent } from "@rmwc/drawer";
import { Logo } from "../util/Logo";
import "./DrawerSettings.scss";

type DrawerSettingsProps = Record<string, never>;

export const DrawerSettings = (props: DrawerSettingsProps) => {
  return (
    <Drawer dismissible open className="drawer-settings">
      <DrawerHeader>
        <Logo className="drawer-logo" />
        <span className="logo-text">CrimeScan</span>
      </DrawerHeader>
      <DrawerContent></DrawerContent>
    </Drawer>
  );
};
