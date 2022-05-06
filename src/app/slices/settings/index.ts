import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "/src/app/store";

type SettingsState = {
  cookies: boolean;
  theme: "dark" | "light";
};

export const initialState: SettingsState = {
  cookies: false,
  theme: "dark",
};

export const settingsSlice = createSlice({
  initialState,
  name: "settings",
  reducers: {
    cookiesAccepted: (state) => {
      state.cookies = true;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === "dark" ? "light" : "dark";
    },
  },
});

export const { cookiesAccepted, toggleTheme } = settingsSlice.actions;

export const selectTheme = (state: RootState) => state.settings.theme;

export const selectCookies = (state: RootState) => state.settings.cookies;

export default settingsSlice.reducer;
