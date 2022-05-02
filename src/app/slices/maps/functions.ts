import { Loader } from "@googlemaps/js-api-loader";

const loader = new Loader({
  apiKey: process.env.GOOGLE_MAPS_KEY as string,
});

let geocoder: google.maps.Geocoder | undefined;

export const loadGoogleMapsAPI = () =>
  loader.load().then(() => {
    geocoder = new google.maps.Geocoder();
  });

export const getGeocodedResults = async (query: string) => {
  if (geocoder && query) {
    let status: google.maps.GeocoderStatus = google.maps.GeocoderStatus.ZERO_RESULTS;
    const result = await geocoder.geocode({ address: query, region: "GB" }, (_, s) => {
      status = s;
    });
    if (!result || status === google.maps.GeocoderStatus.ZERO_RESULTS) {
      throw new Error(google.maps.GeocoderStatus.ZERO_RESULTS);
    } else if (status !== google.maps.GeocoderStatus.OK) {
      throw new Error(status);
    } else {
      return result;
    }
  }
};

export const getStaticMapURL = (
  size: string,
  theme?: "light" | "dark",
  markers?: (
    | {
        styles?: { color?: string; size?: "tiny" | "mid" | "small"; label?: string };
        locations: { lat: string; lng: string }[];
      }
    | boolean
  )[]
) => {
  const baseUrl = new URL("https://maps.googleapis.com/maps/api/staticmap");
  baseUrl.searchParams.set("key", process.env.GOOGLE_MAPS_KEY!);
  baseUrl.searchParams.set("size", size);
  if (theme === "dark") {
    baseUrl.searchParams.set("map_id", "f3b730e3bc8bf288");
  }
  markers?.forEach((marker) => {
    if (typeof marker === "object") {
      const { styles, locations } = marker;
      const stylesString =
        styles &&
        Object.entries(styles)
          .map(([key, val]) => `${key}:${val}`)
          .join("|");
      const locationsString = locations.map(({ lat, lng }) => `${lat},${lng}`).join("|");
      baseUrl.searchParams.append("markers", `${stylesString ? `${stylesString}|` : ""}${locationsString}`);
    }
  });
  return baseUrl.href;
};
