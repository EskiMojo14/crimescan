import { Loader } from "@googlemaps/js-api-loader";
import { queue } from "./snackbarQueue";
import store from "./store";
import { setLoaded } from "../components/input/mapsSlice";

const loader = new Loader({
  apiKey: process.env.GOOGLE_MAPS_KEY as string,
});

export const loadGoogleMapsAPI = () => {
  const { dispatch } = store;
  loader
    .load()
    .then(() => {
      dispatch(setLoaded(true));
    })
    .catch((error) => {
      console.log(error);
      queue.notify({ title: "Failed to load Google Maps API: " + error });
    });
};
