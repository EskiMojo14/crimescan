import { createSlice, isAnyOf, isFulfilled, isPending, isRejected } from "@reduxjs/toolkit";
import { RootState } from "~/app/store";
import { getMonthData, getYearData } from "@s/data";

type DisplayState = {
  theme: "light" | "dark";
  loadingId: string;
};

const initialState: DisplayState = {
  theme: "dark",
  loadingId: "",
};

export const displaySlice = createSlice({
  name: "display",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "dark" ? "light" : "dark";
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(isPending(getMonthData, getYearData), (state, { meta: { requestId } }) => {
        state.loadingId = requestId;
      })
      .addMatcher(
        isAnyOf(isFulfilled(getMonthData, getYearData), isRejected(getMonthData, getYearData)),
        (state, { meta: { requestId } }) => {
          if (state.loadingId === requestId) {
            state.loadingId = "";
          }
        }
      );
  },
});

export const { toggleTheme } = displaySlice.actions;

export const selectTheme = (state: RootState) => state.display.theme;

export const selectLoading = (state: RootState) => !!state.display.loadingId;

export default displaySlice.reducer;
