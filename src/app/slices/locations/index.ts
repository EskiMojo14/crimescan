import { createEntityAdapter, createSlice, EntityState } from "@reduxjs/toolkit";
import { createLatLng } from "@s/maps/functions";
import { SavedLocation } from "@s/locations/types";
import { alphabeticalSortCurried } from "@s/util/functions";
import { RootState } from "/src/app/store";

export const savedLocationEntityAdapter = createEntityAdapter<SavedLocation>({
  selectId: createLatLng,
  sortComparer: (a, b) => alphabeticalSortCurried()(createLatLng(a), createLatLng(b)),
});

type LocationsState = EntityState<SavedLocation>;

export const initialState: LocationsState = savedLocationEntityAdapter.getInitialState();

export const locationsSlice = createSlice({
  name: "locations",
  initialState,
  reducers: {
    setAllLocations: savedLocationEntityAdapter.setAll,
    addLocation: savedLocationEntityAdapter.setOne,
    updateLocation: savedLocationEntityAdapter.upsertOne,
    removeLocation: savedLocationEntityAdapter.removeOne,
  },
});

export const {
  actions: { setAllLocations, addLocation, updateLocation, removeLocation },
} = locationsSlice;

export default locationsSlice.reducer;

export const {
  selectAll: selectAllLocations,
  selectById: selectLocationByLatLng,
  selectEntities: selectLocationMap,
  selectIds: selectLocationLatLngs,
  selectTotal: selectLocationTotal,
} = savedLocationEntityAdapter.getSelectors((state: RootState) => state.locations);
