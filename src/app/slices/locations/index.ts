import type { EntityState } from "@reduxjs/toolkit";
import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { createLatLng } from "@s/maps/functions";
import type { SavedLocation } from "@s/locations/types";
import { alphabeticalSortCurried } from "@s/util/functions";
import type { RootState } from "/src/app/store";

export const savedLocationEntityAdapter = createEntityAdapter<SavedLocation>({
  selectId: createLatLng,
  sortComparer: (a, b) => alphabeticalSortCurried()(createLatLng(a), createLatLng(b)),
});

type LocationsState = EntityState<SavedLocation>;

export const initialState: LocationsState = savedLocationEntityAdapter.getInitialState();

export const locationsSlice = createSlice({
  initialState,
  name: "locations",
  reducers: {
    addLocation: savedLocationEntityAdapter.setOne,
    removeLocation: savedLocationEntityAdapter.removeOne,
    setAllLocations: savedLocationEntityAdapter.setAll,
    updateLocation: savedLocationEntityAdapter.upsertOne,
  },
});

export const {
  actions: { addLocation, removeLocation, setAllLocations, updateLocation },
} = locationsSlice;

export default locationsSlice.reducer;

export const {
  selectAll: selectAllLocations,
  selectById: selectLocationByLatLng,
  selectEntities: selectLocationMap,
  selectIds: selectLocationLatLngs,
  selectTotal: selectLocationTotal,
} = savedLocationEntityAdapter.getSelectors((state: RootState) => state.locations);
