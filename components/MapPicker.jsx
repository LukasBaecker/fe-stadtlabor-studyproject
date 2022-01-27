import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";

var icon = L.icon({
  iconUrl: "/imgs/marker.svg",
  iconAnchor: [21, 42],
  iconSize: [42, 42], // size of the icon
  shadowAnchor: [4, 62], // the same for the shadow
  popupAnchor: [0, -42], // props.point from which the popup should open relative to the iconAnchor
});

function Map({ localPosition, setLocalPosition }) {
  return (
    <MapContainer
      center={[51.960667, 7.626135]}
      zoom={13}
      scrollWheelZoom={true}
      style={{ marginTop: "10px", height: "75vh" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarkers
        localPosition={localPosition}
        setLocalPosition={setLocalPosition}
      />
    </MapContainer>
  );
}

// Marker that shows up when you push a location in the map
function LocationMarkers({ localPosition, setLocalPosition }) {
  const map = useMapEvents({
    click(e) {
      setLocalPosition(e.latlng);
    },
  });

  return (
    <>
      {localPosition[0] === 0 && localPosition[1] === 0 ? (
        <></>
      ) : (
        <Marker position={localPosition} icon={icon}></Marker>
      )}
    </>
  );
}

export default Map;
