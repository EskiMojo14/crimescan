import React, { useEffect, useState } from "react";
import classNames from "classnames";
import emptyImg from "../../media/empty.svg";
import { Typography } from "@rmwc/typography";
import { TopAppBar, TopAppBarRow } from "@rmwc/top-app-bar";
import "./ContentEmpty.scss";

type ContentEmptyProps = {
  open?: boolean;
};

export const ContentEmpty = (props: ContentEmptyProps) => {
  const [open, setOpen] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setOpen(!!props.open);
    }, 200);
  }, [props.open]);
  return open ? (
    <div className={classNames("empty-container", { open: props.open })}>
      <TopAppBar>
        <TopAppBarRow />
      </TopAppBar>
      <div className="content">
        <img className="image" src={emptyImg} alt="Empty" />
        <Typography className="title" use="headline6" tag="h3">
          No data to display
        </Typography>
        <Typography className="subtitle" use="body1" tag="p">
          Enter a query to get started.
        </Typography>
      </div>
    </div>
  ) : (
    <></>
  );
};
