import React from "react";
import { Marker } from "react-leaflet";
import useGeoLocation from "../hooks/useGeoLocation.js";
import L from "leaflet";
const positionMarkerIcon = new L.Icon({
  iconUrl: "/imgs/positionIcon.png",
  iconAnchor: [15, 15],
  iconSize: [30, 30], // size of the icon
  shadowAnchor: [4, 62], // the same for the shadow
  popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
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
