import { addListener, createListenerMiddleware } from "@reduxjs/toolkit";
import type { TypedAddListener, TypedStartListening } from "@reduxjs/toolkit";
import { setupPersistListener } from "/src/app/local-storage";
import type { AppDispatch, RootState } from "/src/app/store";
import { setupDataApiErrorListeners } from "@s/data";

export const listenerMiddleware = createListenerMiddleware();

export type AppStartListening = TypedStartListening<RootState, AppDispatch>;

export const startAppListening = listenerMiddleware.startListening as AppStartListening;

export const addAppListener = addListener as TypedAddListener<RootState, AppDispatch>;

setupPersistListener(startAppListening);

setupDataApiErrorListeners(startAppListening);

export default listenerMiddleware.middleware;
