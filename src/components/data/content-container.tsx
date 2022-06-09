import { Chip } from "@rmwc/chip";
import { TopAppBar, TopAppBarFixedAdjust, TopAppBarRow, TopAppBarSection, TopAppBarTitle } from "@rmwc/top-app-bar";
import { useAppSelector } from "@h";
import { selectQuery } from "@s/data";
import { selectLocationByLatLng } from "@s/locations";
import { createLatLng } from "@s/maps/functions";
import { queryIcons } from "@s/util/constants";
import { CategoryCardMonth, CategoryCardYear } from "./category-card";
import { CountCard } from "./count-card";
import { OutcomeCardMonth, OutcomeCardYear } from "./outcome-card";

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
      <TopAppBarSection alignEnd className="chip-section">
        <Chip
          className="non-interactive"
          icon={query.type === "month" ? queryIcons.month : queryIcons.year}
          label={query.date}
        />
        {savedLocation && <Chip className="non-interactive" icon={queryIcons.location} label={savedLocation.name} />}
        <Chip className="non-interactive" icon={queryIcons.lat} label={query.lat} />
        <Chip className="non-interactive" icon={queryIcons.lng} label={query.lng} />
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
