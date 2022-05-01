import React, { useEffect, useState } from "react";
import classNames from "classnames";
import emptyImg from "../../media/empty.svg";
import emptyCheckImg from "../../media/empty_check.svg";
import { useAppSelector } from "../../app/hooks";
import { selectEmptyData } from "../../app/slices/data";
import { Typography } from "@rmwc/typography";
import { TopAppBarFixedAdjust } from "@rmwc/top-app-bar";
import "./ContentEmpty.scss";

type ContentEmptyProps = {
  open?: boolean;
};

export const ContentEmpty = (props: ContentEmptyProps) => {
  const [open, setOpen] = useState(true);
  useEffect(() => {
    if (props.open) {
      setOpen(!!props.open);
    } else {
      setTimeout(() => {
        setOpen(!!props.open);
      }, 200);
    }
  }, [props.open]);

  const emptyData = useAppSelector(selectEmptyData);

  return open ? (
    <div className={classNames("empty-container", { open: props.open })}>
      <TopAppBarFixedAdjust />
      <div className="content">
        <img className="image" src={emptyData ? emptyCheckImg : emptyImg} alt="Empty" />
        <Typography className="title" use="headline6" tag="h3">
          {emptyData ? "No crimes logged within given period." : "No data to display"}
        </Typography>
        <Typography className="subtitle" use="body1" tag="p">
          {emptyData ? "Congrats!" : "Submit a query to get started."}
        </Typography>
      </div>
    </div>
  ) : (
    <></>
  );
};
