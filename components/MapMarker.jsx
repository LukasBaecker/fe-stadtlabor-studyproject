import React, { useState } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentPoint } from "../store/actions";
import Dropdown from "react-bootstrap/Dropdown";
import isEmpty from "../helpers/isEmpty";
import { joinGarden } from "../helpers/manageGarden";
import Tooltip from "react-bootstrap/Tooltip";
import { useRouter } from "next/router";
import {
  faChevronDown,
  faCopy,
  faInfo,
} from "@fortawesome/free-solid-svg-icons";
import Collapse from "react-bootstrap/Collapse";
import Button from "react-bootstrap/Button";

const MapMarker = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const map = useMap();
  const lang = useSelector((state) => state.lang);
  const currentPoint = useSelector((state) => state.currentPoint);
  const [openList, setOpenList] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const resources = useSelector((state) => state.resources);
  const isAuth = useSelector((state) => state.auth.isAuthenticated);
  const handleFlyTo = () => {
    map.flyTo(
      [props.point.properties.latitude, props.point.properties.longitude],
      map.getZoom()
    );
  };
  const iconLink = () => {
    if (currentPoint != -1 && currentPoint === props.point.id) {
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
      {getResourceInformation(element).resource_name} (
      {getResourceInformation(element).resource_status ===
      "AVAILABLE FOR DONATION"
        ? lang === "eng"
          ? "donation"
          : "abzugeben"
        : lang === "eng"
        ? "to borrow"
        : "zu verleihen"}
      )
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
          <div
            id={"tooltip-top"}
            className={
              copySuccess ? "clipboardSuccess" : "clipboardSuccess hidden"
            }>
            {lang === "eng"
              ? "Coordinates copied to clipboard"
              : "Koordinaten in Zwischenablage kopiert"}
          </div>

          <CopyToClipboard text={locString}>
            <Button
              onClick={() => {
                setCopySuccess(true);
                setTimeout(() => {
                  setCopySuccess(false);
                }, 3000);
              }}>
              <FontAwesomeIcon icon={faCopy} />
            </Button>
          </CopyToClipboard>
          <Button
            className='infoButton'
            onClick={() => {
              router.push("/garden/" + props.point.id);
            }}>
            <FontAwesomeIcon icon={faInfo} />
          </Button>
          {isAuth ? (
            <>
              {!isEmpty(props.user) ? (
                props.user.garden.includes(props.point.id) ? (
                  <Button
                    variant='secondary'
                    className='join'
                    onClick={() => {}}
                    disabled>
                    {lang === "eng" ? "Member" : "Mitglied"}
                  </Button>
                ) : (
                  <JoinButton
                    userDetails={props.user}
                    gardenId={props.point.id}
                  />
                )
              ) : null}
            </>
          ) : (
            <></>
          )}
        </div>
      </Popup>
      {currentPoint === props.point.id && currentPoint != -1 ? (
        handleFlyTo()
      ) : (
        <></>
      )}
    </Marker>
  );
};

const JoinButton = (props) => {
  const lang = useSelector((state) => state.lang);
  const router = useRouter();
  const handleTheClick = async (userDetails, gardenId) => {
    const success = await joinGarden(userDetails, gardenId);
    if (success) {
      router.reload();
    } else {
      console.log("not successful");
    }
  };

  return (
    <>
      <Button
        className='join'
        onClick={() => {
          handleTheClick(props.userDetails, props.gardenId);
        }}>
        {lang === "eng" ? "Join" : "Beitreten"}
      </Button>
    </>
  );
};
export default MapMarker;
