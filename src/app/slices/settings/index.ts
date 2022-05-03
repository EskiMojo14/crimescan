import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "/src/app/store";

type SettingsState = {
  theme: "light" | "dark";
};

export const initialState: SettingsState = {
  theme: "dark",
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "dark" ? "light" : "dark";
    },
  },
});

export const { toggleTheme } = settingsSlice.actions;

export const selectTheme = (state: RootState) => state.settings.theme;

export default settingsSlice.reducer;
