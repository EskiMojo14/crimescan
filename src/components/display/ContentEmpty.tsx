import React from "react";
import emptyImg from "@m/empty.svg";
import emptyCheckImg from "@m/empty_check.svg";
import { useAppSelector } from "@h";
import { selectInitialLoad } from "@s/data";
import { Typography } from "@rmwc/typography";
import { TopAppBarFixedAdjust } from "@rmwc/top-app-bar";
import "./ContentEmpty.scss";

export const ContentEmpty = () => {
  const initialLoad = useAppSelector(selectInitialLoad);

  return (
    <div className={"empty-container"}>
      <TopAppBarFixedAdjust />
      <div className="content">
        <img className="image" src={!initialLoad ? emptyCheckImg : emptyImg} alt="Empty" />
        <Typography className="title" use="headline6" tag="h3">
          {!initialLoad ? "No crimes logged within given period." : "No data to display"}
        </Typography>
        <Typography className="subtitle" use="body1" tag="p">
          {!initialLoad ? "Congrats!" : "Submit a query to get started."}
        </Typography>
      </div>
    </div>
  );
};
