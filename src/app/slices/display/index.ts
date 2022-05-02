import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "~/app/store";

type DisplayState = {
  theme: "light" | "dark";
  loading: boolean;
};

const initialState: DisplayState = {
  theme: "dark",
  loading: false,
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
});

export const { toggleTheme, setTheme, toggleLoading, setLoading } = displaySlice.actions;

export const selectTheme = (state: RootState) => state.display.theme;

export const selectLoading = (state: RootState) => state.display.loading;

export default displaySlice.reducer;
