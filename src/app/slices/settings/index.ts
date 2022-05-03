import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "/src/app/store";

type SettingsState = {
  theme: "light" | "dark";
  cookies: boolean;
};

export const initialState: SettingsState = {
  theme: "dark",
  cookies: false,
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "dark" ? "light" : "dark";
    },
    cookiesAccepted: (state) => {
      state.cookies = true;
    },
  },
});

export const { toggleTheme, cookiesAccepted } = settingsSlice.actions;

export const selectTheme = (state: RootState) => state.settings.theme;

export const selectCookies = (state: RootState) => state.settings.cookies;

export default settingsSlice.reducer;
