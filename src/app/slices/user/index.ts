import { createEntityAdapter, createSlice, EntityId, EntityState, PayloadAction } from "@reduxjs/toolkit";
import { SavedLocation } from "@s/user/types";
import { alphabeticalSortCurried } from "@s/util/functions";
import { RootState } from "/src/app/store";

export const createLatLng = ({ lat, lng }: { lat: string; lng: string }) => `${lat},${lng}`;

export const savedLocationEntityAdapter = createEntityAdapter<SavedLocation>({
  selectId: createLatLng,
  sortComparer: (a, b) => alphabeticalSortCurried()(createLatLng(a), createLatLng(b)),
});

type UserState = {
  locations: EntityState<SavedLocation>;
};

export const initialState: UserState = {
  locations: savedLocationEntityAdapter.getInitialState(),
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setAllLocations: (state, action: PayloadAction<SavedLocation[]>) => {
      savedLocationEntityAdapter.setAll(state.locations, action);
    },
    addLocation: (state, action: PayloadAction<SavedLocation>) => {
      savedLocationEntityAdapter.setOne(state.locations, action);
    },
    updateLocation: (state, action: PayloadAction<SavedLocation>) => {
      savedLocationEntityAdapter.upsertOne(state.locations, action);
    },
    removeLocation: (state, action: PayloadAction<EntityId>) => {
      savedLocationEntityAdapter.removeOne(state.locations, action);
    },
    useExampleLocations: (state) => {
      savedLocationEntityAdapter.setAll(state.locations, [
        {
          name: "London",
          lat: "51.5072178",
          lng: "-0.1275862",
        },
        {
          name: "Bath",
          lat: "51.3781018",
          lng: "-2.3596827",
        },
        {
          name: "Bristol",
          lat: "51.454513",
          lng: "-2.58791",
        },
      ]);
    },
  },
});

export const {
  actions: { setAllLocations, addLocation, updateLocation, removeLocation },
} = userSlice;

export default userSlice.reducer;

export const {
  selectAll: selectAllLocations,
  selectById: selectLocationByLatLng,
  selectEntities: selectLocationMap,
  selectIds: selectLocationLatLngs,
  selectTotal: selectLocationTotal,
} = savedLocationEntityAdapter.getSelectors((state: RootState) => state.user.locations);
