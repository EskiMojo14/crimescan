import { Loader } from "@googlemaps/js-api-loader";

export const createLatLng = ({ lat, lng }: { lat: string; lng: string }) => `${lat},${lng}`;

const loader = new Loader({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string,
});

let geocoder: google.maps.Geocoder | undefined;

export const loadGoogleMapsAPI = () =>
  loader.load().then(() => {
    geocoder = new google.maps.Geocoder();
  });

export const getGeocodedResults = async (query: string) => {
  if (geocoder && query) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return await geocoder.geocode({ address: query, region: "GB" }, () => {});
  }
};

export type UppercaseLetter =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L"
  | "M"
  | "N"
  | "O"
  | "P"
  | "Q"
  | "R"
  | "S"
  | "T"
  | "U"
  | "V"
  | "W"
  | "X"
  | "Y"
  | "Z";

export const getStaticMapURL = (
  size: string,
  theme?: "dark" | "light",
  markers?: (
    | boolean
    | {
        locations: { lat: string; lng: string }[];
        styles?: { color?: string; label?: UppercaseLetter; size?: "mid" | "small" | "tiny" };
      }
  )[]
) => {
  const baseUrl = new URL("https://maps.googleapis.com/maps/api/staticmap");
  baseUrl.searchParams.set("key", process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!);
  baseUrl.searchParams.set("size", size);
  if (theme === "dark") {
    baseUrl.searchParams.set("map_id", "f3b730e3bc8bf288");
  }
  markers?.forEach((marker) => {
    if (typeof marker === "object") {
      const { locations, styles } = marker;
      const stylesString =
        styles &&
        Object.entries(styles)
          .map(([key, val]) => `${key}:${val}`)
          .join("|");
      const locationsString = locations.map(createLatLng).join("|");
      baseUrl.searchParams.append("markers", `${stylesString ? `${stylesString}|` : ""}${locationsString}`);
    }
  });
  return baseUrl.href;
};
