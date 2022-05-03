import listener from "@mw/listener";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import data from "@s/data";
import settings from "@s/settings";
import { loadState } from "/src/app/localStorage";

const reducer = combineReducers({
  data,
  settings,
});

export type RootState = ReturnType<typeof reducer>;

export const createStore = (preloadedState?: Partial<RootState>) =>
  configureStore({
    preloadedState,
    reducer,
    middleware: (gDM) => gDM().prepend(listener),
  });

export const store = createStore(loadState());

export type AppDispatch = typeof store.dispatch;

export default store;
