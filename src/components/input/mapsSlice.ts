import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

type MapsState = {
  loaded: boolean;
};

export const initialState: MapsState = {
  loaded: false,
};

export const mapsSlice = createSlice({
  name: "maps",
  initialState,
  reducers: {
    setLoaded: (state, action: PayloadAction<boolean>) => {
      state.loaded = action.payload;
    },
  },
});

export const { setLoaded } = mapsSlice.actions;

export const selectMapsLoaded = (state: RootState) => state.maps.loaded;

export default mapsSlice.reducer;
