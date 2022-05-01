import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { MapResult } from "../../../util/types";

type MapsState = {
  loaded: boolean;
  loading: boolean;
  noResults: boolean;
  result: MapResult;
};

const blankResult = {
  lat: "",
  lng: "",
  name: "",
};

export const initialState: MapsState = {
  loaded: false,
  loading: false,
  noResults: true,
  result: blankResult,
};

export const mapsSlice = createSlice({
  name: "maps",
  initialState,
  reducers: {
    setLoaded: (state, action: PayloadAction<boolean>) => {
      state.loaded = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setNoResults: (state, action: PayloadAction<boolean>) => {
      state.noResults = action.payload;
      state.result = blankResult;
    },
    setResult: (state, action: PayloadAction<MapResult>) => {
      state.noResults = false;
      state.result = action.payload;
    },
  },
});

export const { setLoaded, setLoading, setNoResults, setResult } = mapsSlice.actions;

export const selectMapsLoaded = (state: RootState) => state.maps.loaded;

export const selectMapsLoading = (state: RootState) => state.maps.loading;

export const selectMapsNoResults = (state: RootState) => state.maps.noResults;

export const selectMapsResult = (state: RootState) => state.maps.result;

export default mapsSlice.reducer;
