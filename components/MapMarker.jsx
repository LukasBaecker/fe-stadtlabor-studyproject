import { relative } from "path";
import React, { useState, useEffect } from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useSelector } from "react-redux";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import Collapse from "react-bootstrap/Collapse";
import Button from "react-bootstrap/Button";
const MapMarker = (point) => {
  const [openList, setOpenList] = useState(false);
  const resources = useSelector((state) => state.resources);
  var orangeIcon = L.icon({
    iconUrl: "/imgs/LOGO.svg",
    iconAnchor: [21, 42],
    iconSize: [42, 42], // size of the icon
    shadowAnchor: [4, 62], // the same for the shadow
    popupAnchor: [0, -42], // point from which the popup should open relative to the iconAnchor
  });

  var locString =
    "" + point.properties.longitude + "°N, " + point.properties.latitude + "°E";
  const listResources = point.properties.resources.map((element) => (
    <li>
      {resources.find((e) => (e.resource_id = element)).resource_name} (
      {resources.find((e) => (e.resource_id = element)).resource_status})
    </li>
  ));
  return (
    <>
      <Marker
        icon={orangeIcon}
        key={
          "key" +
          point.properties.id +
          point.properties.longitude +
          point.properties.latitude
        }
        position={[point.properties.longitude, point.properties.latitude]}>
        <Popup
          key={
            "keyPopup" +
            point.properties.id +
            point.properties.longitude +
            point.properties.latitude
          }
          className='request-popup'>
          <div className='popupInfos'>
            <h1>{point.properties.name}</h1>
            <p>
              Address: {point.properties.address}
              <br />
              Phone: {point.properties.phone}
              <br />
              Mail: {point.properties.email}
            </p>
            <div
              className='popupDropdownResources'
              onClick={() => {
                setOpenList(!openList);
              }}>
              <p>
                Resources ({point.properties.resources.length}){" "}
                <FontAwesomeIcon
                  className={
                    openList ? "dropdownIcon dropdownOpened" : "dropdownIcon"
                  }
                  icon={faChevronDown}
                />
              </p>
            </div>
            <Collapse in={openList}>
              <ul>{listResources}</ul>
            </Collapse>
          </div>
          <div>
            <CopyToClipboard text={locString}>
              <Button className='copyLinkButton' onClick={() => {}}>
                click here to copy coordinates
              </Button>
            </CopyToClipboard>
          </div>
        </Popup>
      </Marker>
    </>
  );
};
export default MapMarker;
