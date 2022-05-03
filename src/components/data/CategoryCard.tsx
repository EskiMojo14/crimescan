import React, { useMemo, useState } from "react";
import classNames from "classnames";
import { useImmer } from "use-immer";
import { useAppSelector } from "@h";
import { months } from "@s/util/constants";
import { iconObject, addOrRemove } from "@s/util/functions";
import { selectAllCategories, selectCategoryCount } from "@s/data";
import type { IPieChartOptions, IBarChartOptions, ILineChartOptions } from "chartist";
import ChartistGraph from "react-chartist";
import chartistPluginAxisTitle from "chartist-plugin-axistitle";
import { Card } from "@rmwc/card";
import { Checkbox } from "@rmwc/checkbox";
import {
  DataTable,
  DataTableContent,
  DataTableBody,
  DataTableHead,
  DataTableRow,
  DataTableHeadCell,
  DataTableCell,
} from "@rmwc/data-table";
import { Typography } from "@rmwc/typography";
import { SegmentedButton, SegmentedButtonSegment } from "@c/util/SegmentedButton";
import "./CategoryCard.scss";

const letters = "abcdefghijklmnopqrstuvwxyz".split("");

export const CategoryCardMonth = () => {
  const allCategories = useAppSelector(selectAllCategories);
  const categoryCount = useAppSelector(selectCategoryCount);
  const series = useMemo(() => categoryCount.flat(), [categoryCount]);

  const chartData = {
    labels: [],
    series,
  };
  const chartOptions: IPieChartOptions = {
    labelInterpolationFnc: (value: number) => {
      return Math.round((value / chartData.series.reduce((a, b) => a + b, 0)) * 100) + "%";
    },
  };

  const [focused, updateFocused] = useImmer<string[]>([]);
  const focus = (letter: string) => updateFocused((focused) => addOrRemove(focused, letter));

  const focusAll = () => {
    if (focused.length === allCategories.length) {
      updateFocused([]);
    } else {
      updateFocused(letters.slice(0, allCategories.length));
    }
  };

  return (
    <Card
      className={classNames(
        "category-card",
        { focused: focused.length > 0 },
        focused.map((letter) => "focused-" + letter)
      )}
    >
      <div className="title-container">
        <Typography use="headline5" tag="h3">
          Categories
        </Typography>
      </div>
      <div className="chart-container">
        <ChartistGraph type="Pie" data={chartData} options={chartOptions} className="ct-square" />
      </div>
      <div className="table-container">
        <DataTable>
          <DataTableContent>
            <DataTableHead>
              <DataTableRow>
                <DataTableHeadCell hasFormControl>
                  <Checkbox
                    indeterminate={focused.length > 0 && focused.length !== allCategories.length}
                    checked={focused.length === allCategories.length}
                    onClick={focusAll}
                  />
                </DataTableHeadCell>
                <DataTableHeadCell className="right-border">Category</DataTableHeadCell>
                <DataTableHeadCell isNumeric>Count</DataTableHeadCell>
              </DataTableRow>
            </DataTableHead>
            <DataTableBody>
              {allCategories.map((category, index) => {
                return (
                  <DataTableRow className={"series-" + letters[index]} key={category}>
                    <DataTableCell hasFormControl>
                      <Checkbox checked={focused.includes(letters[index])} onClick={() => focus(letters[index])} />
                    </DataTableCell>
                    <DataTableCell className="right-border indicator">{category}</DataTableCell>
                    <DataTableCell isNumeric>{categoryCount[index][0]}</DataTableCell>
                  </DataTableRow>
                );
              })}
            </DataTableBody>
          </DataTableContent>
        </DataTable>
      </div>
    </Card>
  );
};

export const CategoryCardYear = () => {
  const allCategories = useAppSelector(selectAllCategories);
  const categoryCount = useAppSelector(selectCategoryCount);

  const [chartType, setChartType] = useState<"bar" | "line">("bar");

  const chartData = {
    labels: months,
    series: categoryCount,
  };
  const chartOptions = {
    low: 0,
    axisY: {
      onlyInteger: true,
    },
    chartPadding: {
      top: 16,
      right: 0,
      bottom: 32,
      left: 16,
    },
    plugins: [
      chartistPluginAxisTitle({
        axisX: {
          axisTitle: "Month",
          axisClass: "ct-axis-title",
          offset: {
            x: 0,
            y: 48,
          },
          textAnchor: "middle",
        },
        axisY: {
          axisTitle: "Count",
          axisClass: "ct-axis-title",
          offset: {
            x: 0,
            y: 24,
          },
          flipTitle: true,
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
      <ChartistGraph type="Bar" data={chartData} options={barChartOptions} className="ct-major-eleventh" />
    ) : null;
  const lineChart =
    chartType === "line" ? (
      <ChartistGraph type="Line" data={chartData} options={lineChartOptions} className="ct-major-eleventh" />
    ) : null;

  const [focused, updateFocused] = useImmer<string[]>([]);
  const focus = (letter: string) => updateFocused((focused) => addOrRemove(focused, letter));

  const focusAll = () => {
    if (focused.length === allCategories.length) {
      updateFocused([]);
    } else {
      updateFocused(letters.slice(0, allCategories.length));
    }
  };

  return (
    <Card
      className={classNames(
        "category-card",
        { focused: focused.length > 0 },
        focused.map((letter) => "focused-" + letter)
      )}
    >
      <div className="title-container">
        <Typography use="headline5" tag="h3">
          Categories
        </Typography>
        <SegmentedButton toggle>
          <SegmentedButtonSegment
            icon={iconObject(
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                version="1.1"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M22,21H2V3H4V19H6V17H10V19H12V16H16V19H18V17H22V21M18,14H22V16H18V14M12,6H16V9H12V6M16,15H12V10H16V15M6,10H10V12H6V10M10,16H6V13H10V16Z" />
              </svg>
            )}
            selected={chartType === "bar"}
            onClick={() => setChartType("bar")}
          />
          <SegmentedButtonSegment
            icon={iconObject(
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                version="1.1"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M16,11.78L20.24,4.45L21.97,5.45L16.74,14.5L10.23,10.75L5.46,19H22V21H2V3H4V17.54L9.5,8L16,11.78Z" />
              </svg>
            )}
            selected={chartType === "line"}
            onClick={() => setChartType("line")}
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
                    indeterminate={focused.length > 0 && focused.length !== allCategories.length}
                    checked={focused.length === allCategories.length}
                    onClick={focusAll}
                  />
                </DataTableHeadCell>
                <DataTableHeadCell className="right-border">Category</DataTableHeadCell>
                {months.map((month) => {
                  return (
                    <DataTableHeadCell isNumeric key={month}>
                      {month}
                    </DataTableHeadCell>
                  );
                })}
              </DataTableRow>
            </DataTableHead>
            <DataTableBody>
              {allCategories.map((category, catIndex) => {
                return (
                  <DataTableRow className={"series-" + letters[catIndex]} key={category}>
                    <DataTableCell hasFormControl>
                      <Checkbox
                        checked={focused.includes(letters[catIndex])}
                        onClick={() => focus(letters[catIndex])}
                      />
                    </DataTableCell>
                    <DataTableCell className="right-border indicator">{category}</DataTableCell>
                    {months.map((month, index) => {
                      return (
                        <DataTableHeadCell isNumeric key={month}>
                          {categoryCount[catIndex][index] > 0 ? categoryCount[catIndex][index] : ""}
                        </DataTableHeadCell>
                      );
                    })}
                  </DataTableRow>
                );
              })}
            </DataTableBody>
          </DataTableContent>
        </DataTable>
      </div>
    </Card>
  );
};