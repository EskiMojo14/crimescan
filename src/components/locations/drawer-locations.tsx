import LocationCard from "@c/locations/location-card";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@rmwc/drawer";
import { Typography } from "@rmwc/typography";
import { createLatLng } from "@s/maps/functions";
import { useAppSelector } from "@h";
import useScrollLock from "@h/use-scroll-lock";
import { selectLocationLatLngs } from "@s/locations";
import emptyImg from "@m/empty.svg";
import "./drawer-locations.scss";

type DrawerLocationsProps = {
  latLng: { lat: string; lng: string };
  onClose: () => void;
  open: boolean;
  setLatLng: (latLng: { lat: string; lng: string }) => void;
};

export const DrawerLocations = ({ latLng, onClose, open, setLatLng }: DrawerLocationsProps) => {
  useScrollLock(open, "drawer-favourites");
  const locationLatLngs = useAppSelector(selectLocationLatLngs);
  const applyLatLng = (latLngId: string) => {
    const [lat, lng] = latLngId.split(",");
    setLatLng({ lat, lng });
  };
  return (
    <Drawer {...{ onClose, open }} className="drawer-favourites drawer-right" modal>
      <DrawerHeader>
        <DrawerTitle>Saved locations</DrawerTitle>
      </DrawerHeader>
      <DrawerContent>
        {locationLatLngs.length ? (
          locationLatLngs.map((latLngId) => (
            <LocationCard
              key={latLngId}
              applyLatLng={applyLatLng}
              latLngId={latLngId}
              selected={latLngId === createLatLng(latLng)}
            />
          ))
        ) : (
          <div className="no-result-display">
            <img alt="Empty" className="image" src={emptyImg} />
            <Typography className="title" tag="h3" use="headline6">
              No locations saved
            </Typography>
            <Typography className="subtitle" tag="p" use="body1">
              Add some using the query drawer!
            </Typography>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default DrawerLocations;
