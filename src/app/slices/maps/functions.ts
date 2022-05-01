import { Loader } from "@googlemaps/js-api-loader";
import debounce from "lodash.debounce";
import { queue } from "../../snackbarQueue";
import store from "../../store";
import { setLoaded, setLoading, setNoResults, setResult } from ".";
import { MapResult } from "./types";
import { statusCodes } from "./constants";

const loader = new Loader({
  apiKey: process.env.GOOGLE_MAPS_KEY as string,
});

let geocoder: google.maps.Geocoder;

export const loadGoogleMapsAPI = () => {
  const { dispatch } = store;
  loader
    .load()
    .then(() => {
      dispatch(setLoaded(true));
      geocoder = new google.maps.Geocoder();
    })
    .catch((error) => {
      console.log(error);
      queue.notify({ title: "Failed to load Google Maps API: " + error });
    });
};

const getGeocodedResults = (query: string) => {
  const { dispatch } = store;
  const { loaded } = store.getState().maps;
  if (loaded && query) {
    const processResults = (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
      if (status !== "OK" && status !== "ZERO_RESULTS") {
        dispatch(setLoading(false));
        console.log(status);
        queue.notify({ title: "Failed to get geocoding results: " + statusCodes[status] });
      } else if (status === "ZERO_RESULTS" || !results) {
        dispatch(setLoading(false));
        dispatch(setNoResults(true));
      } else if (results) {
        const firstResult = results[0];
        const formattedResult: MapResult = {
          name: firstResult.formatted_address,
          lat: `${firstResult.geometry.location.lat()}`,
          lng: `${firstResult.geometry.location.lng()}`,
        };
        dispatch(setLoading(false));
        dispatch(setResult(formattedResult));
      }
    };
    dispatch(setLoading(true));
    geocoder.geocode({ address: query, region: "GB" }, processResults);
  }
};

export const geocodeSearch = debounce(getGeocodedResults, 400);

export const getStaticMapURL = (
  size: string,
  theme?: "light" | "dark",
  markers?: ({ color: string; lat: string; lng: string } | boolean)[]
) => {
  const baseUrl = new URL("https://maps.googleapis.com/maps/api/staticmap");
  baseUrl.searchParams.set("key", process.env.GOOGLE_MAPS_KEY!);
  baseUrl.searchParams.set("size", size);
  if (theme === "dark") {
    baseUrl.searchParams.set("map_id", "f3b730e3bc8bf288");
  }
  markers?.forEach((marker) => {
    if (typeof marker === "object") {
      const { color, lat, lng } = marker;
      baseUrl.searchParams.append("markers", `color:0x${color}|${lat},${lng}`);
    }
  });
  return baseUrl.href;
};
