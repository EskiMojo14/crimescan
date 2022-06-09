import { TopAppBarFixedAdjust } from "@rmwc/top-app-bar";
import { Typography } from "@rmwc/typography";
import { useAppSelector } from "@h";
import { selectQuery } from "@s/data";
import "./content-empty.module.scss";

export const ContentEmpty = () => {
  const query = useAppSelector(selectQuery);

  return (
    <div className="empty-container">
      <TopAppBarFixedAdjust />
      <div className="content">
        <img alt="Empty" className="image" src={query ? "/empty_check.svg" : "/empty.svg"} />
        <Typography className="title" tag="h3" use="headline6">
          {query ? "No crimes logged within given period." : "No data to display"}
        </Typography>
        <Typography className="subtitle" tag="p" use="body1">
          {query ? "Congrats!" : "Submit a query to get started."}
        </Typography>
      </div>
    </div>
  );
};

export default ContentEmpty;
