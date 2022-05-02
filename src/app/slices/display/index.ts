import { createSlice, isAnyOf, isFulfilled, isPending, isRejected, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "~/app/store";
import { getMonthData, getYearData } from "@s/data";

type DisplayState = {
  theme: "light" | "dark";
  loading: string;
};

const initialState: DisplayState = {
  theme: "dark",
  loading: "",
};

export const displaySlice = createSlice({
  name: "display",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "dark" ? "light" : "dark";
    },
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(isPending(getMonthData, getYearData), (state, { meta: { requestId } }) => {
        state.loading = requestId;
      })
      .addMatcher(
        isAnyOf(isFulfilled(getMonthData, getYearData), isRejected(getMonthData, getYearData)),
        (state, { meta: { requestId } }) => {
          if (state.loading === requestId) {
            state.loading = "";
          }
        }
      );
  },
});

export const { toggleTheme, setTheme } = displaySlice.actions;

export const selectTheme = (state: RootState) => state.display.theme;

export const selectLoading = (state: RootState) => !!state.display.loading;

export default displaySlice.reducer;
