import { SegmentedButton, SegmentedButtonSegment } from "@c/util/segmented-button";
import { SkeletonBlock, SkeletonIcon } from "@c/util/skeleton-block";
import { Card } from "@rmwc/card";
import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableContent,
  DataTableHead,
  DataTableHeadCell,
  DataTableRow,
} from "@rmwc/data-table";
import { months } from "@s/util/constants";
import { iconObject, randomInt } from "@s/util/functions";

type SkeletonCategoryCardProps = {
  chartType?: "bar" | "line";
  outcome?: boolean;
  year?: boolean;
};

export const SkeletonCategoryCard = ({ chartType, outcome, year }: SkeletonCategoryCardProps) => (
  <Card className="category-card">
    <div className="title-container">
      <SkeletonBlock content={outcome ? "Outcomes" : "Categories"} tag="h3" typography="headline5" />
      {year && (
        <SegmentedButton toggle>
          <SegmentedButtonSegment
            className="skeleton"
            icon={iconObject(<SkeletonIcon height={18} width={18} />)}
            ripple={false}
            selected={chartType === "bar"}
          />
          <SegmentedButtonSegment
            className="skeleton"
            icon={iconObject(<SkeletonIcon height={18} width={18} />)}
            ripple={false}
            selected={chartType === "line"}
          />
        </SegmentedButton>
      )}
    </div>
    <div className="chart-container">
      <SkeletonBlock className={year ? "ct-major-eleventh" : "ct-square"} />
    </div>
    <div className="table-container">
      <DataTable>
        <DataTableContent>
          <DataTableHead>
            <DataTableRow>
              <DataTableHeadCell hasFormControl>
                <SkeletonIcon />
              </DataTableHeadCell>
              <DataTableHeadCell className="right-border">
                <SkeletonBlock content="Category" />
              </DataTableHeadCell>
              {[...Array(year ? 12 : 1)].map((i, index) => (
                <DataTableHeadCell key={months[index]} isNumeric>
                  <SkeletonBlock content={year ? months[index] : "Count"} />
                </DataTableHeadCell>
              ))}
            </DataTableRow>
          </DataTableHead>
          <DataTableBody>
            {[...Array(randomInt(2, 5))].map((i, index) => (
              <DataTableRow key={months[index]}>
                <DataTableCell hasFormControl>
                  <SkeletonIcon />
                </DataTableCell>
                <DataTableCell className="right-border">
                  <SkeletonBlock maxContentLength={outcome ? 35 : 20} minContentLength={outcome ? 15 : 7} />
                </DataTableCell>
                {[...Array(year ? 12 : 1)].map((i, index) => (
                  <DataTableHeadCell key={months[index]} isNumeric>
                    <SkeletonBlock content="1" width="1em" />
                  </DataTableHeadCell>
                ))}
              </DataTableRow>
            ))}
          </DataTableBody>
        </DataTableContent>
      </DataTable>
    </div>
  </Card>
);

export default SkeletonCategoryCard;
