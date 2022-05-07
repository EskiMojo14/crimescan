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

type SkeletonCategoryCardYearProps = {
  chartType: "bar" | "line";
  outcome?: boolean;
};

export const SkeletonCategoryCardYear = ({ chartType, outcome }: SkeletonCategoryCardYearProps) => (
  <Card className="category-card">
    <div className="title-container">
      <SkeletonBlock content={outcome ? "Outcomes" : "Categories"} tag="h3" typography="headline5" />
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
    </div>
    <div className="chart-container">
      <SkeletonBlock className="ct-major-eleventh" />
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
              {[...Array(12)].map((i, index) => (
                <DataTableHeadCell key={months[index]} isNumeric>
                  <SkeletonBlock content={months[index]} />
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
                {[...Array(12)].map((i, index) => (
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
