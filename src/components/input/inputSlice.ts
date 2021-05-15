import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

type InputState = {
  query: {
    dateMode: "month" | "year";
    month: string;
    year: string;
    lat: string;
    lng: string;
  };
  search: {
    query: string;
  };
};

export const initialState: InputState = {
  query: {
    dateMode: "month",
    month: "",
    year: "",
    lat: "",
    lng: "",
  },
  search: {
    query: "",
  },
};

export const inputSlice = createSlice({
  name: "input",
  initialState,
  reducers: {
    inputSetQuery: <T extends keyof InputState["query"]>(
      state: InputState,
      action: PayloadAction<{ key: T; value: InputState["query"][T] }>
    ) => {
      const { key, value } = action.payload;
      state.query[key] = value;
    },
    inputSetSearch: <T extends keyof InputState["search"]>(
      state: InputState,
      action: PayloadAction<{ key: T; value: InputState["search"][T] }>
    ) => {
      const { key, value } = action.payload;
      state.search[key] = value;
    },
    setLatLng: (state, action: PayloadAction<{ lat: string; lng: string }>) => {
      state.query.lat = action.payload.lat;
      state.query.lng = action.payload.lng;
    },
  },
});

export const { inputSetQuery, inputSetSearch, setLatLng } = inputSlice.actions;

export const selectDateMode = (state: RootState) => state.input.query.dateMode;

export const selectMonth = (state: RootState) => state.input.query.month;

export const selectYear = (state: RootState) => state.input.query.year;

export const selectLat = (state: RootState) => state.input.query.lat;

export const selectLng = (state: RootState) => state.input.query.lng;

export const selectSearchQuery = (state: RootState) => state.input.search.query;

export default inputSlice.reducer;
