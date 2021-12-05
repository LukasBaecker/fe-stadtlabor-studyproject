import { relative } from "path";
import React, { useState, useEffect } from "react";
import { Marker, Popup } from "react-leaflet";
import marker_ico from "../public/imgs/markerIcon.png";
import L from "leaflet";
import Button from "react-bootstrap/Button";
const MapMarker = (point) => {
  var iconM = marker_ico;
  var xM = 42;
  var iconS = [25, 41];

  iconM = marker_ico;
  iconS = [xM, xM];

  var orangeIcon = L.icon({
    iconUrl: iconM,
    iconSize: iconS, // size of the icon
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
          <img className='center' src={iconM} alt='this is a marker' />

          {type_desc}
          {name}
          {add_desc}
          {hours_desc}
          {loc}
          {web_desc}
        </Popup>
      </Marker>
    </>
  );
};
export default MapMarker;
