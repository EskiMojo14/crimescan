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
  favourites: EntityState<SavedLocation>;
};

export const initialState: UserState = {
  favourites: savedLocationEntityAdapter.getInitialState(),
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setAllFavourites: (state, action: PayloadAction<SavedLocation[]>) => {
      savedLocationEntityAdapter.setAll(state.favourites, action);
    },
    addFavourite: (state, action: PayloadAction<SavedLocation>) => {
      savedLocationEntityAdapter.setOne(state.favourites, action);
    },
    updateFavourite: (state, action: PayloadAction<SavedLocation>) => {
      savedLocationEntityAdapter.upsertOne(state.favourites, action);
    },
    removeFavourite: (state, action: PayloadAction<EntityId>) => {
      savedLocationEntityAdapter.removeOne(state.favourites, action);
    },
    useExampleFavourites: (state) => {
      savedLocationEntityAdapter.setAll(state.favourites, [
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
  actions: { setAllFavourites, addFavourite, updateFavourite, removeFavourite },
} = userSlice;

export default userSlice.reducer;

export const {
  selectAll: selectAllFavourites,
  selectById: selectFavouriteByLatLng,
  selectEntities: selectFavouriteMap,
  selectIds: selectFavouriteLatLngs,
  selectTotal: selectFavouriteTotal,
} = savedLocationEntityAdapter.getSelectors((state: RootState) => state.user.favourites);
