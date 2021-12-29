import { relative } from "path";
import React, { useState, useEffect } from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Button from "react-bootstrap/Button";
const MapMarker = (point) => {
  var orangeIcon = L.icon({
    iconUrl: "/imgs/markerIcon.png",
    iconAnchor: [13, 42],
    iconSize: [26, 42], // size of the icon
    shadowAnchor: [4, 62], // the same for the shadow
    popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
  });

  return (
    <>
      <Marker
        icon={orangeIcon}
        key={"key" + point.geometry.coordinates + point.properties.id}
        position={[
          point.geometry.coordinates[1],
          point.geometry.coordinates[0],
        ]}>
        <Popup
          key={"keyPopup" + point.geometry.coordinates + point.properties.id}
          className='request-popup'>
          <p>This is a popu</p>
        </Popup>
      </Marker>
    </>
  );
};
export default MapMarker;
