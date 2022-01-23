import React, { useEffect } from "react";
import { Marker, useMap } from "react-leaflet";
import useGeoLocation from "../hooks/useGeoLocation.js";
import L from "leaflet";
import { useDispatch } from "react-redux";
const positionMarkerIcon = new L.Icon({
  iconUrl: "/imgs/positionIcon.png",
  iconAnchor: [15, 15],
  iconSize: [30, 30], // size of the icon
  shadowAnchor: [4, 62], // the same for the shadow
  popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
});

const LocationMarker = (props) => {
  const map = useMap();
  const location = useGeoLocation();

  const handleLocation = () => {
    map.flyTo([location.coordinates.lat, location.coordinates.lng], 15);

    (async () => {
      try {
        const request = await fetch(
          "http://giv-project15:9000/api/v1/gardens/all/get_nearest_gardens?x=" +
            location.coordinates.lng +
            "&y=" +
            location.coordinates.lat,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        const content = await request.json();
        console.log(content);
      } catch (e) {
        console.log("error: ", e);
      }
    })();
  };
  return (
    location.loaded &&
    !location.error && (
      <>
        {handleLocation()}
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
