import React, { useState } from "react";
import { Drawer, DrawerHeader, DrawerContent } from "@rmwc/drawer";
import { IconButton } from "@rmwc/icon-button";
import { LinearProgress } from "@rmwc/linear-progress";
import { Logo } from "../util/Logo";
import "./DrawerSettings.scss";

type DrawerSettingsProps = {
  loading: boolean;
  getData: () => void;
};

export const DrawerSettings = (props: DrawerSettingsProps) => {
  const [theme, setTheme] = useState("dark");
  const changeTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.className = newTheme;
  };
  return (
    <Drawer dismissible open className="drawer-settings">
      <DrawerHeader>
        <Logo className="drawer-logo" rotate={props.loading} onClick={props.getData} />
        <div className="logo-text">CrimeScan</div>
        <IconButton icon={theme === "dark" ? "dark_mode" : "light_mode"} onClick={changeTheme} />
        <LinearProgress closed={!props.loading} />
      </DrawerHeader>
      <DrawerContent></DrawerContent>
    </Drawer>
  );
};
