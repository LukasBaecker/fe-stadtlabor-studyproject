import React, { useState } from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentPoint } from "../store/actions";
import Dropdown from "react-bootstrap/Dropdown";
import {
  faChevronDown,
  faCopy,
  faInfo,
} from "@fortawesome/free-solid-svg-icons";
import Collapse from "react-bootstrap/Collapse";
import Button from "react-bootstrap/Button";

const MapMarker = (props) => {
  const dispatch = useDispatch();
  const lang = useSelector((state) => state.lang);
  const currentPoint = useSelector((state) => state.currentPoint);
  const [openList, setOpenList] = useState(false);
  const resources = useSelector((state) => state.resources);

  const iconLink = () => {
    if (currentPoint === props.point.id) {
      return "/imgs/marker.svg";
    }
    return "/imgs/marker_inactive.svg";
  };
  var icon = L.icon({
    iconUrl: iconLink(),
    iconAnchor: [21, 42],
    iconSize: [42, 42], // size of the icon
    shadowAnchor: [4, 62], // the same for the shadow
    popupAnchor: [0, -42], // props.point from which the popup should open relative to the iconAnchor
  });
  const getResourceInformation = (id) => {
    let resourceInformation = {};
    resources.forEach((r) => {
      if (r.resource_id === id) {
        resourceInformation = r;
      }
    });
    return resourceInformation;
  };
  var locString =
    "" +
    props.point.properties.latitude +
    "°N, " +
    props.point.properties.longitude +
    "°E";
  const listResources = props.point.properties.resources.map((element) => (
    <li key={element}>
      {getResourceInformation(element).resource_name}(
      {getResourceInformation(element).resource_status})
    </li>
  ));
  return (
    <Marker
      icon={icon}
      key={
        "key" +
        props.point.id +
        props.point.properties.longitude +
        props.point.properties.latitude
      }
      position={[
        props.point.properties.latitude,
        props.point.properties.longitude,
      ]}
      eventHandlers={{
        click: (e) => {
          dispatch(setCurrentPoint(props.point.id));
        },
      }}>
      <Popup
        key={
          "keyPopup" +
          props.point.id +
          props.point.properties.longitude +
          props.point.properties.latitude
        }
        className='request-popup'>
        <div className='popupInfos'>
          <h1>{props.point.properties.name}</h1>
          <p>
            {lang === "eng" ? "Adress: " : "Adresse: "}{" "}
            {props.point.properties.address}
            <br />
            {lang === "eng" ? "Contact: " : "Kontakt: "}{" "}
            {props.point.properties.email}
          </p>
          <div
            className='popupDropdownResources'
            onClick={() => {
              setOpenList(!openList);
            }}>
            <p>
              {lang === "eng" ? "Resources" : "Ressourcen "}(
              {props.point.properties.resources.length}){" "}
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
        <Dropdown.Divider />
        <div className='markerPopupButton'>
          <CopyToClipboard text={locString}>
            <Button onClick={() => {}}>
              <FontAwesomeIcon icon={faCopy} />
            </Button>
          </CopyToClipboard>
          <Button onClick={() => {}}>
            <FontAwesomeIcon icon={faInfo} />
          </Button>
          <Button className=' join' onClick={() => {}}>
            Join
          </Button>
        </div>
      </Popup>
    </Marker>
  );
};
export default MapMarker;
