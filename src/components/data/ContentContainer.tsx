import React from "react";
import { useAppSelector } from "@h";
import { queryIcons } from "@s/util/constants";
import { selectQuery } from "@s/data";
import { Chip } from "@rmwc/chip";
import { TopAppBar, TopAppBarRow, TopAppBarFixedAdjust, TopAppBarSection, TopAppBarTitle } from "@rmwc/top-app-bar";
import { createLatLng, selectLocationByLatLng } from "@s/user";
import { CountCard } from "./CountCard";
import { CategoryCardMonth, CategoryCardYear } from "./CategoryCard";
import { OutcomeCardMonth, OutcomeCardYear } from "./OutcomeCard";
import "./ContentContainer.scss";

export const ContentContainer = () => {
  const query = useAppSelector(selectQuery);
  if (!query) {
    return null;
  }
  const savedLocation = useAppSelector((state) =>
    selectLocationByLatLng(state, createLatLng({ lat: query.lat, lng: query.lng }))
  );

  const queryChips =
    query.lat && query.lng ? (
      <TopAppBarSection alignEnd>
        <Chip
          label={query.date}
          icon={query.type === "month" ? queryIcons.month : queryIcons.year}
          className="non-interactive"
        />
        {savedLocation && <Chip label={savedLocation.name} icon={queryIcons.location} className="non-interactive" />}
        <Chip label={query.lat} icon={queryIcons.lat} className="non-interactive" />
        <Chip label={query.lng} icon={queryIcons.lng} className="non-interactive" />
      </TopAppBarSection>
    ) : null;

  const countCard = query.type === "year" ? <CountCard /> : null;
  const categoryCard = query.type === "month" ? <CategoryCardMonth /> : <CategoryCardYear />;
  const outcomeCard = query.type === "month" ? <OutcomeCardMonth /> : <OutcomeCardYear />;
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

export default ContentContainer;
