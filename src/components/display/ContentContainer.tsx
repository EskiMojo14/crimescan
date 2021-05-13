import React from "react";
import { useAppSelector } from "../../app/hooks";
import { queryIcons } from "../../util/constants";
import { selectQuery } from "./dataSlice";
import { Chip } from "@rmwc/chip";
import { TopAppBar, TopAppBarRow, TopAppBarFixedAdjust, TopAppBarSection, TopAppBarTitle } from "@rmwc/top-app-bar";
import { CategoryCard } from "./CategoryCard";
import "./ContentContainer.scss";

export const ContentContainer = () => {
  const query = useAppSelector(selectQuery);
  const dateChip =
    query.type === "month" ? (
      <Chip label={query.month} icon={queryIcons.month} className="non-interactive" />
    ) : (
      <Chip label={query.year} icon={queryIcons.year} className="non-interactive" />
    );
  const queryChips =
    query.lat && query.lng ? (
      <TopAppBarSection alignEnd>
        {dateChip}
        <Chip label={query.lat} icon={queryIcons.lat} className="non-interactive" />
        <Chip label={query.lng} icon={queryIcons.lng} className="non-interactive" />
      </TopAppBarSection>
    ) : null;
  const content =
    query.type === "month" ? (
      <>
        <CategoryCard />
      </>
    ) : (
      <>
        <CategoryCard />
      </>
    );
  return (
    <div className="content-container">
      <TopAppBar fixed>
        <TopAppBarRow>
          <TopAppBarSection alignStart>
            <TopAppBarTitle>Result</TopAppBarTitle>
          </TopAppBarSection>
          {queryChips}
        </TopAppBarRow>
      </TopAppBar>
      <TopAppBarFixedAdjust />
      <div className="content-grid">{content}</div>
    </div>
  );
};
