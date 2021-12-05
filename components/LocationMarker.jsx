import React from "react";
import { Marker } from "react-leaflet";
import useGeoLocation from "../hooks/useGeoLocation.js";
import positionMarker from "../public/imgs/markerIcon.png";
import L from "leaflet";
const positionMarkerIcon = new L.Icon({
  iconUrl: positionMarker,
  iconSize: [25, 41], // size of the icon
  shadowAnchor: [4, 62], // the same for the shadow
});

const LocationMarker = () => {
  const location = useGeoLocation();

  return (
    location.loaded &&
    !location.error && (
      <>
        <Marker
          icon={positionMarkerIcon}
          position={[
            location.coordinates.lat,
            location.coordinates.lng,
          ]}></Marker>
      </>
    )
  );
};
export default LocationMarker;
