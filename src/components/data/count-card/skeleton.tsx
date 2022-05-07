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
import { iconObject } from "@s/util/functions";

type SkeletonCountCardProps = {
  chartType: "bar" | "line";
};

export const SkeletonCountCard = ({ chartType }: SkeletonCountCardProps) => (
  <Card className="count-card">
    <div className="title-container">
      <SkeletonBlock content="Count" tag="h3" typography="headline5" />
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
              <DataTableHeadCell className="right-border">
                <SkeletonBlock content="Month" />
              </DataTableHeadCell>
              {Array(12)
                .fill("")
                .map((i, index) => (
                  <DataTableHeadCell key={months[index]} isNumeric>
                    <SkeletonBlock content={months[index]} />
                  </DataTableHeadCell>
                ))}
            </DataTableRow>
          </DataTableHead>
          <DataTableBody>
            <DataTableRow>
              <DataTableCell className="right-border">
                <SkeletonBlock content="Count" />
              </DataTableCell>
              {Array(12)
                .fill("")
                .map((i, index) => (
                  <DataTableHeadCell key={months[index]} isNumeric>
                    <SkeletonBlock content="1" width="1em" />
                  </DataTableHeadCell>
                ))}
            </DataTableRow>
          </DataTableBody>
        </DataTableContent>
      </DataTable>
    </div>
  </Card>
);
