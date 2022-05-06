import { useMemo, useState } from "react";
import { SegmentedButton, SegmentedButtonSegment } from "@c/util/segmented-button";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { Card } from "@rmwc/card";
import { Checkbox } from "@rmwc/checkbox";
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
import { months } from "@s/util/constants";
import { addOrRemove, iconObject } from "@s/util/functions";
import type { IBarChartOptions, ILineChartOptions, IPieChartOptions } from "chartist";
import chartistPluginAxisTitle from "chartist-plugin-axistitle";
import classNames from "classnames";
import ChartistGraph from "react-chartist";
import { useImmer } from "use-immer";
import { useAppSelector } from "@h";
import { selectAllOutcomes, selectOutcomeCount, selectQuery, useGetMonthDataQuery, useGetYearDataQuery } from "@s/data";

const letters = "abcdefghijklmnopqrstuvwxyz".split("");

export const OutcomeCardMonth = () => {
  const query = useAppSelector(selectQuery);
  const { allOutcomes, outcomeCount } = useGetMonthDataQuery(query ?? skipToken, {
    selectFromResult: ({ data, originalArgs }) => ({
      allOutcomes: selectAllOutcomes(data),
      outcomeCount: selectOutcomeCount(data, originalArgs),
    }),
  });
  const series = useMemo(() => outcomeCount.flat(), [outcomeCount]);
  const chartData = {
    labels: [],
    series,
  };
  const chartOptions: IPieChartOptions = {
    labelInterpolationFnc: (value: number) =>
      `${Math.round((value / chartData.series.reduce((a, b) => a + b)) * 100)}%`,
  };

  const [focused, updateFocused] = useImmer<string[]>([]);
  const focus = (letter: string) => updateFocused((focused) => addOrRemove(focused, letter));
  const focusAll = () => {
    if (focused.length === allOutcomes.length) {
      updateFocused([]);
    } else {
      updateFocused(letters.slice(0, allOutcomes.length));
    }
  };

  return (
    <Card
      className={classNames(
        "category-card",
        { focused: focused.length > 0 },
        focused.map((letter) => `focused-${letter}`)
      )}
    >
      <div className="title-container">
        <Typography tag="h3" use="headline5">
          Outcomes
        </Typography>
      </div>
      <div className="chart-container">
        <ChartistGraph className="ct-square" data={chartData} options={chartOptions} type="Pie" />
      </div>
      <div className="table-container">
        <DataTable>
          <DataTableContent>
            <DataTableHead>
              <DataTableRow>
                <DataTableHeadCell hasFormControl>
                  <Checkbox
                    checked={focused.length === allOutcomes.length}
                    indeterminate={focused.length > 0 && focused.length !== allOutcomes.length}
                    onClick={focusAll}
                  />
                </DataTableHeadCell>
                <DataTableHeadCell className="right-border">Outcome</DataTableHeadCell>
                <DataTableHeadCell isNumeric>Count</DataTableHeadCell>
              </DataTableRow>
            </DataTableHead>
            <DataTableBody>
              {allOutcomes.map((category, index) => (
                <DataTableRow key={category} className={`series-${letters[index]}`}>
                  <DataTableCell hasFormControl>
                    <Checkbox checked={focused.includes(letters[index])} onClick={() => focus(letters[index])} />
                  </DataTableCell>
                  <DataTableCell className="right-border indicator">{category}</DataTableCell>
                  <DataTableCell isNumeric>{outcomeCount[index]}</DataTableCell>
                </DataTableRow>
              ))}
            </DataTableBody>
          </DataTableContent>
        </DataTable>
      </div>
    </Card>
  );
};

export const OutcomeCardYear = () => {
  const query = useAppSelector(selectQuery);
  const { allOutcomes, outcomeCount } = useGetYearDataQuery(query ?? skipToken, {
    selectFromResult: ({ data, originalArgs }) => ({
      allOutcomes: selectAllOutcomes(data),
      outcomeCount: selectOutcomeCount(data, originalArgs),
    }),
  });

  const [chartType, setChartType] = useState<"bar" | "line">("bar");

  const chartData = {
    labels: months,
    series: outcomeCount,
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
  // workaround: react-chartist doesn't re-render on type change.
  const barChart =
    chartType === "bar" ? (
      <ChartistGraph className="ct-major-eleventh" data={chartData} options={barChartOptions} type="Bar" />
    ) : null;
  const lineChart =
    chartType === "line" ? (
      <ChartistGraph className="ct-major-eleventh" data={chartData} options={lineChartOptions} type="Line" />
    ) : null;

  const [focused, updateFocused] = useImmer<string[]>([]);
  const focus = (letter: string) => updateFocused((focused) => addOrRemove(focused, letter));

  const focusAll = () => {
    if (focused.length === allOutcomes.length) {
      updateFocused([]);
    } else {
      updateFocused(letters.slice(0, allOutcomes.length));
    }
  };

  return (
    <Card
      className={classNames(
        "category-card",
        { focused: focused.length > 0 },
        focused.map((letter) => `focused-${letter}`)
      )}
    >
      <div className="title-container">
        <Typography tag="h3" use="headline5">
          Outcomes
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
                <DataTableHeadCell hasFormControl>
                  <Checkbox
                    checked={focused.length === allOutcomes.length}
                    indeterminate={focused.length > 0 && focused.length !== allOutcomes.length}
                    onClick={focusAll}
                  />
                </DataTableHeadCell>
                <DataTableHeadCell className="right-border">Category</DataTableHeadCell>
                {months.map((month) => (
                  <DataTableHeadCell key={month} isNumeric>
                    {month}
                  </DataTableHeadCell>
                ))}
              </DataTableRow>
            </DataTableHead>
            <DataTableBody>
              {allOutcomes.map((category, catIndex) => (
                <DataTableRow key={category} className={`series-${letters[catIndex]}`}>
                  <DataTableCell hasFormControl>
                    <Checkbox checked={focused.includes(letters[catIndex])} onClick={() => focus(letters[catIndex])} />
                  </DataTableCell>
                  <DataTableCell className="right-border indicator">{category}</DataTableCell>
                  {months.map((month, index) => (
                    <DataTableHeadCell key={month} isNumeric>
                      {outcomeCount[catIndex]?.[index] || ""}
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
};
