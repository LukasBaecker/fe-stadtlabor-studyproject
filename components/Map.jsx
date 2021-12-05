import React, { useState } from "react";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { MapContainer, LayersControl, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import MapMarker from "../components/MapMarker.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import LocationMarker from "../components/LocationMarker.jsx";
import { useMediaQuery } from "react-responsive";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-shadow.png",
});

function Map() {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 767px)" });
  //const points = useSelector((state) => state.points);
  const [locationActivate, setLocationActivate] = useState(false);

  //that was for polygons but may be changed to marker design
  const geoJSONstyle = () => {
    return {
      // the fillColor is adapted from a property which can be changed by the user (segment)
      fillColor: colors.color - primary,
      //stroke-width: to have a constant width on the screen need to adapt with scale
      opacity: 1,
      color: colors.color - primary,
      fillOpacity: 0.5,
    };
  };

  return (
    <>
      <MapContainer
        center={[51.960667, 7.626135]}
        zoom={13}
        zoomControl={false}
        className={isTabletOrMobile ? "map" : "map desktop"}>
        <LayersControl position='topleft'>
          <LayersControl.BaseLayer name='OpenStreetMap'>
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer checked name='OSM Reduced Colors'>
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url='https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png'
            />
          </LayersControl.BaseLayer>
        </LayersControl>
        {locationActivate ? <LocationMarker /> : ""}

        {/*<MarkerClusterGroup polygonOptions={geoJSONstyle()}>
          {isTabletOrMobile
            ? points.features.map((p) => MapMarker(p))
            : points.features.map((p) => MapMarker(p))}
          </MarkerClusterGroup>*/}
      </MapContainer>
      <div id='positioningDiv' className='location-div'>
        <button
          className={
            locationActivate ? "btn btn-primary" : "btn btn-primary grey"
          }
          onClick={() => {
            setLocationActivate(!locationActivate);
          }}>
          <FontAwesomeIcon
            icon={faMapMarkerAlt}
            style={{ fontSize: "1.6em" }}
          />
        </button>
      </div>
    </>
  );
}

export default Map;
