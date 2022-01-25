import React, { useEffect } from "react";
import { Marker, useMap } from "react-leaflet";
import useGeoLocation from "../hooks/useGeoLocation.js";
import L from "leaflet";
import { useDispatch, useSelector } from "react-redux";
import {
  setGardenLocations,
  setFilteredLocations,
  setResources,
  setFilterCategories,
} from "../store/actions/gardenAndResources.js";
import { setLocationPosition } from "../store/actions/index.js";
import { gardenGetNearestUrl } from "../helpers/urls.jsx";
import { useState } from "react";

const positionMarkerIcon = new L.Icon({
  iconUrl: "/imgs/positionIcon.png",
  iconAnchor: [15, 15],
  iconSize: [30, 30], // size of the icon
  shadowAnchor: [4, 62], // the same for the shadow
  popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
});

const LocationMarker = (props) => {
  const dispatch = useDispatch();
  const map = useMap();
  const location = useGeoLocation();

  const handleLocation = () => {
    map.flyTo([location.coordinates.lat, location.coordinates.lng], 15);
    dispatch(
      setLocationPosition([location.coordinates.lng, location.coordinates.lat])
    );
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
