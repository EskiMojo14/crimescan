import { useState } from "react";
import { skipToken } from "@reduxjs/toolkit/query/react";
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
import { Typography } from "@rmwc/typography";
import type { IBarChartOptions, ILineChartOptions } from "chartist";
import chartistPluginAxisTitle from "chartist-plugin-axistitle";
import ChartistGraph from "react-chartist";
import { SkeletonCountCard } from "@c/data/count-card/skeleton";
import { SegmentedButton, SegmentedButtonSegment } from "@c/util/segmented-button";
import { useAppSelector } from "@h";
import { selectCountSeries, selectQuery, useGetYearDataQuery } from "@s/data";
import { months } from "@s/util/constants";
import { iconObject } from "@s/util/functions";

export const CountCard = () => {
  const query = useAppSelector(selectQuery);
  const { count, fetching } = useGetYearDataQuery(query ?? skipToken, {
    selectFromResult: ({ data, isFetching, originalArgs }) => ({
      count: selectCountSeries(data, originalArgs),
      fetching: isFetching,
    }),
  });
  const chartData = {
    labels: months,
    series: [count],
  };
  const chartOptions = {
    axisY: {
      onlyInteger: true,
    },
    chartPadding: {
      bottom: 32,
      left: 16,
      right: 0,
      top: 16,
    },
    low: 0,
    plugins: [
      chartistPluginAxisTitle({
        axisX: {
          axisClass: "ct-axis-title",
          axisTitle: "Month",
          offset: {
            x: 0,
            y: 48,
          },
          textAnchor: "middle",
        },
        axisY: {
          axisClass: "ct-axis-title",
          axisTitle: "Count",
          flipTitle: true,
          offset: {
            x: 0,
            y: 24,
          },
        },
      }),
    ],
  };
  const lineChartOptions: ILineChartOptions = {
    showArea: true,
    ...chartOptions,
  };
  const barChartOptions: IBarChartOptions = {
    stackBars: true,
    ...chartOptions,
  };

  const [chartType, setChartType] = useState<"bar" | "line">("line");

  // workaround: react-chartist doesn't re-render on type change.
  const barChart =
    chartType === "bar" ? (
      <ChartistGraph className="ct-major-eleventh themed" data={chartData} options={barChartOptions} type="Bar" />
    ) : null;
  const lineChart =
    chartType === "line" ? (
      <ChartistGraph className="ct-major-eleventh themed" data={chartData} options={lineChartOptions} type="Line" />
    ) : null;

  if (fetching) {
    return <SkeletonCountCard chartType={chartType} />;
  }

  return (
    <Card className="count-card">
      <div className="title-container">
        <Typography tag="h3" use="headline5">
          Count
        </Typography>
        <SegmentedButton toggle>
          <SegmentedButtonSegment
            icon={iconObject(
              <svg
                height="24"
                version="1.1"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
              >
                <path d="M22,21H2V3H4V19H6V17H10V19H12V16H16V19H18V17H22V21M18,14H22V16H18V14M12,6H16V9H12V6M16,15H12V10H16V15M6,10H10V12H6V10M10,16H6V13H10V16Z" />
              </svg>
            )}
            onClick={() => setChartType("bar")}
            selected={chartType === "bar"}
          />
          <SegmentedButtonSegment
            icon={iconObject(
              <svg
                height="24"
                version="1.1"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
              >
                <path d="M16,11.78L20.24,4.45L21.97,5.45L16.74,14.5L10.23,10.75L5.46,19H22V21H2V3H4V17.54L9.5,8L16,11.78Z" />
              </svg>
            )}
            onClick={() => setChartType("line")}
            selected={chartType === "line"}
          />
        </SegmentedButton>
      </div>
      <div className="chart-container">
        {barChart}
        {lineChart}
      </div>
      <div className="table-container">
        <DataTable>
          <DataTableContent>
            <DataTableHead>
              <DataTableRow>
                <DataTableHeadCell className="right-border">Month</DataTableHeadCell>
                {Array(12)
                  .fill("")
                  .map((i, index) => (
                    <DataTableHeadCell key={months[index]} isNumeric>
                      {months[index]}
                    </DataTableHeadCell>
                  ))}
              </DataTableRow>
            </DataTableHead>
            <DataTableBody>
              <DataTableRow>
                <DataTableCell className="right-border">Count</DataTableCell>
                {Array(12)
                  .fill("")
                  .map((i, index) => (
                    <DataTableHeadCell key={months[index]} isNumeric>
                      {count[index] > 0 ? count[index] : ""}
                    </DataTableHeadCell>
                  ))}
              </DataTableRow>
            </DataTableBody>
          </DataTableContent>
        </DataTable>
      </div>
    </Card>
  );
};
