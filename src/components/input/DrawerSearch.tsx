import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { initialState, inputSetSearch, selectSearchQuery } from "./inputSlice";
import { hasKey } from "../../util/functions";
import { Button } from "@rmwc/button";
import { Drawer, DrawerHeader, DrawerContent, DrawerTitle } from "@rmwc/drawer";
import { IconButton } from "@rmwc/icon-button";
import { TextField } from "@rmwc/textfield";
import "./DrawerSearch.scss";

type DrawerSearchProps = {
  open: boolean;
  close: () => void;
};

export const DrawerSearch = (props: DrawerSearchProps) => {
  const dispatch = useAppDispatch();
  const search = useAppSelector(selectSearchQuery);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    if (hasKey(initialState.search, name)) {
      dispatch(inputSetSearch({ key: name, value: value }));
    }
  };
  const clearSearch = () => {
    dispatch(inputSetSearch({ key: "query", value: "" }));
  };
  return (
    <Drawer open={props.open} onClose={props.close} modal className="drawer-search drawer-right">
      <DrawerHeader>
        <DrawerTitle>Location search</DrawerTitle>
        <Button label="Confirm" outlined />
      </DrawerHeader>
      <div className="search-container">
        <TextField
          label="Search"
          icon="travel_explore"
          outlined
          name="query"
          value={search}
          onChange={handleChange}
          trailingIcon={<IconButton icon="clear" onClick={clearSearch} />}
        />
      </div>
      <DrawerContent></DrawerContent>
    </Drawer>
  );
};
