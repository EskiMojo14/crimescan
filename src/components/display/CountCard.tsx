import React from "react";
import { useAppSelector } from "../../app/hooks";
import { months } from "../../util/constants";
import { selectType, selectYearData } from "./dataSlice";
import { Card } from "@rmwc/card";
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
import "./CountCard.scss";

export const CountCard = () => {
  const dataType = useAppSelector(selectType);
  const data = useAppSelector(selectYearData);
  if (dataType === "year") {
    const { count } = data;
    return (
      <Card className="count-card">
        <Typography use="headline5" tag="h3">
          Count
        </Typography>
        <div className="table-container">
          <DataTable>
            <DataTableContent>
              <DataTableHead>
                <DataTableRow>
                  <DataTableHeadCell>Month</DataTableHeadCell>
                  {Array(12)
                    .fill("")
                    .map((i, index) => {
                      return (
                        <DataTableHeadCell isNumeric key={months[index]}>
                          {months[index]}
                        </DataTableHeadCell>
                      );
                    })}
                </DataTableRow>
              </DataTableHead>
              <DataTableBody>
                <DataTableRow>
                  <DataTableCell>Count</DataTableCell>
                  {Array(12)
                    .fill("")
                    .map((i, index) => {
                      return (
                        <DataTableHeadCell isNumeric key={months[index]}>
                          {count[index] > 0 ? count[index] : ""}
                        </DataTableHeadCell>
                      );
                    })}
                </DataTableRow>
              </DataTableBody>
            </DataTableContent>
          </DataTable>
        </div>
      </Card>
    );
  }
  return <></>;
};
