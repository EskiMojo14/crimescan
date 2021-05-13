import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

const applyTheme = (theme: "light" | "dark") => {
  document.documentElement.className = theme;
  const meta = document.querySelector("meta[name=theme-color]");
  if (meta) {
    meta.setAttribute("content", getComputedStyle(document.documentElement).getPropertyValue("--meta-color"));
  }
};

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
      const newTheme = state.theme === "dark" ? "light" : "dark";
      applyTheme(newTheme);
      state.theme = newTheme;
    },
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      applyTheme(action.payload);
      state.theme = action.payload;
    },
    toggleLoading: (state) => {
      state.loading = !state.loading;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setCategories: (state, action: PayloadAction<Record<string, string>>) => {
      state.formattedCategories = action.payload;
    },
  },
});

export const { toggleTheme, setTheme, toggleLoading, setLoading, setCategories } = displaySlice.actions;

export const selectTheme = (state: RootState) => state.display.theme;

export const selectLoading = (state: RootState) => state.display.loading;

export const selectFormattedCategories = (state: RootState) => state.display.formattedCategories;

export default displaySlice.reducer;
