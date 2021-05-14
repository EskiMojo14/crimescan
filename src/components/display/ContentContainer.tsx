import React from "react";
import { useAppSelector } from "../../app/hooks";
import { queryIcons } from "../../util/constants";
import { selectQuery, selectType } from "./dataSlice";
import { Chip } from "@rmwc/chip";
import { TopAppBar, TopAppBarRow, TopAppBarFixedAdjust, TopAppBarSection, TopAppBarTitle } from "@rmwc/top-app-bar";
import { CountCard } from "./CountCard";
import { CategoryCardMonth, CategoryCardYear } from "./CategoryCard";
import { OutcomeCardMonth, OutcomeCardYear } from "./OutcomeCard";
import "./ContentContainer.scss";

export const ContentContainer = () => {
  const query = useAppSelector(selectQuery);
  const dataType = useAppSelector(selectType);
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
  const countCard = dataType === "year" ? <CountCard /> : null;
  const categoryCard = dataType === "month" ? <CategoryCardMonth /> : <CategoryCardYear />;
  const outcomeCard = dataType === "month" ? <OutcomeCardMonth /> : <OutcomeCardYear />;
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
      <div className="content-grid">
        {countCard}
        {categoryCard}
        {outcomeCard}
      </div>
    </div>
  );
};
