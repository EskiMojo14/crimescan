import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "~/app/store";

export const getCrimeCategories = createAsyncThunk("display/getCrimeCategories", () =>
  fetch("https://data.police.uk/api/crime-categories")
    .then((response) => response.json())
    .then(
      (value): Record<string, string> =>
        value.reduce((acc: Record<string, string>, { url, name }: { url: string; name: string }) => {
          acc[url] = name;
          return acc;
        }, {})
    )
);

type DisplayState = {
  theme: "light" | "dark";
  loading: boolean;
  formattedCategories: Record<string, string>;
};

const initialState: DisplayState = {
  theme: "dark",
  loading: false,
  formattedCategories: {},
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
    toggleLoading: (state) => {
      state.loading = !state.loading;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCrimeCategories.fulfilled, (state, { payload }) => {
      state.formattedCategories = payload;
    });
  },
});

export const { toggleTheme, setTheme, toggleLoading, setLoading } = displaySlice.actions;

export const selectTheme = (state: RootState) => state.display.theme;

export const selectLoading = (state: RootState) => state.display.loading;

export const selectFormattedCategories = (state: RootState) => state.display.formattedCategories;

export default displaySlice.reducer;
