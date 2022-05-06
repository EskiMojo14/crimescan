import React from "react";
import emptyImg from "@m/empty.svg";
import emptyCheckImg from "@m/empty_check.svg";
import { useAppSelector } from "@h";
import { selectQuery } from "@s/data";
import { Typography } from "@rmwc/typography";
import { TopAppBarFixedAdjust } from "@rmwc/top-app-bar";
import "./ContentEmpty.scss";

export const ContentEmpty = () => {
  const query = useAppSelector(selectQuery);

  return (
    <div className="empty-container">
      <TopAppBarFixedAdjust />
      <div className="content">
        <img className="image" src={query ? emptyCheckImg : emptyImg} alt="Empty" />
        <Typography className="title" use="headline6" tag="h3">
          {query ? "No crimes logged within given period." : "No data to display"}
        </Typography>
        <Typography className="subtitle" use="body1" tag="p">
          {query ? "Congrats!" : "Submit a query to get started."}
        </Typography>
      </div>
    </div>
  );
};

export default ContentEmpty;
