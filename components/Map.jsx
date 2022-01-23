import React, { useState } from "react";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { MapContainer, LayersControl, TileLayer } from "react-leaflet";
import L from "leaflet";
import MapMarker from "../components/MapMarker.jsx";
import LocationMarker from "../components/LocationMarker.jsx";
import { useMediaQuery } from "react-responsive";
import { useSelector } from "react-redux";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-shadow.png",
});

function Map() {
  const filtered_locations = useSelector((state) => state.filtered_locations);
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const locationActivate = useSelector((state) => state.location_active);
  //that was for polygons but may be changed to marker design
  const polygonStyle = {
    // the fillColor is adapted from a property which can be changed by the user (segment)
    fillColor: "#eae7dc",
    //stroke-width: to have a constant width on the screen need to adapt with scale
    opacity: 1,
    color: "#d8c3a5",
    fillOpacity: 0.5,
  };
  const clusterGroup = () => {
    if (filtered_locations.features != undefined) {
      return (
        <MarkerClusterGroup polygonOptions={polygonStyle}>
          {filtered_locations.features.map((p) => (
            <MapMarker
              point={p}
              key={
                "key" + p.id + p.properties.longitude + p.properties.latitude
              }
            />
          ))}
        </MarkerClusterGroup>
      );
    }
  };
  return (
    <>
      <MapContainer
        center={[51.960667, 7.626135]}
        zoom={13}
        zoomControl={false}
        className={isTabletOrMobile ? "map" : "map desktop"}>
        <LayersControl position='topleft'>
          <LayersControl.BaseLayer key='1stLayer' checked name='OpenStreetMap'>
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer key='2ndLayer' name='OSM Reduced Colors'>
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url='https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png'
            />
          </LayersControl.BaseLayer>
        </LayersControl>
        {clusterGroup()}
        {locationActivate ? <LocationMarker key='theUsersLocation' /> : <></>}
      </MapContainer>
    </>
  );
}

export default Map;
