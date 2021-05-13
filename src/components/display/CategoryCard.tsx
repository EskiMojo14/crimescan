import React from "react";
import { useAppSelector } from "../../app/hooks";
import { months } from "../../util/constants";
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
import "./CategoryCard.scss";

export const CategoryCard = () => {
  const data = useAppSelector((state) => state.data);
  if (data.type === "month") {
    const { allCategories, categoryCount } = data;
    return (
      <Card className="category-card">
        <Typography use="headline5" tag="h3">
          Categories
        </Typography>
        <div className="table-container">
          <DataTable>
            <DataTableContent>
              <DataTableHead>
                <DataTableRow>
                  <DataTableHeadCell>Category</DataTableHeadCell>
                  <DataTableHeadCell isNumeric>Count</DataTableHeadCell>
                </DataTableRow>
              </DataTableHead>
              <DataTableBody>
                {allCategories.map((category, index) => {
                  return (
                    <DataTableRow key={category}>
                      <DataTableCell>{category}</DataTableCell>
                      <DataTableCell isNumeric>{categoryCount[index]}</DataTableCell>
                    </DataTableRow>
                  );
                })}
              </DataTableBody>
            </DataTableContent>
          </DataTable>
        </div>
      </Card>
    );
  } else {
    const { allCategories, categoryCount } = data;
    return (
      <Card className="category-card">
        <Typography use="headline5" tag="h3">
          Categories
        </Typography>
        <div className="table-container">
          <DataTable>
            <DataTableContent>
              <DataTableHead>
                <DataTableRow>
                  <DataTableHeadCell>Category</DataTableHeadCell>
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
                {allCategories.map((category, catIndex) => {
                  return (
                    <DataTableRow key={category}>
                      <DataTableCell>{category}</DataTableCell>
                      {Array(12)
                        .fill("")
                        .map((i, index) => {
                          return (
                            <DataTableHeadCell isNumeric key={months[index]}>
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
  }
};
