import React, { useEffect } from "react";
import useGeoLocation from "../hooks/useGeoLocation.js";
import { useDispatch, useSelector } from "react-redux";
import {
  setGardenLocations,
  setFilteredLocations,
  setResources,
  setFilterCategories,
} from "../store/actions/gardenAndResources.js";
import { gardenGetNearestUrl } from "../helpers/urls.jsx";
import { faCommentsDollar } from "@fortawesome/free-solid-svg-icons";

const UpdateLocation = (props) => {
  const dispatch = useDispatch();
  const locationPosition = useSelector((state) => state.location_position);
  const gardenlocations = useSelector((state) => state.locations.features);
  const filteredelocations = useSelector(
    (state) => state.filtered_locations.features
  );

  const addResourcesInformation = (id) => {
    let resourceInformation = {};
    gardenlocations.forEach((g) => {
      if (g.id === id) {
        resourceInformation = g.properties.resources;
      }
    });
    return resourceInformation;
  };
  const isInFilteredLocations = (e) => {
    let isInside = false;
    filteredelocations.forEach((f) => {
      if (f.id === e.id) {
        isInside = true;
      }
    });
    return isInside;
  };
  const addDistanceToGardens = () => {
    const newLocations = [];
    const newFilteredLocations = [];
    (async () => {
      try {
        const request = await fetch(
          gardenGetNearestUrl(locationPosition[0], locationPosition[1]),
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        const content = await request.json();
        content.features.forEach((e) => {
          e = {
            ...e,
            properties: {
              ...e.properties,
              resources: addResourcesInformation(e.id),
            },
          };
          if (isInFilteredLocations(e) === true) {
            console.log("Yes");
            newFilteredLocations.push(e);
          } else {
            console.log("NO");
          }
          newLocations.push(e);
        });
        dispatch(
          setFilteredLocations({
            ...content,
            features: newFilteredLocations,
          })
        );
        dispatch(setGardenLocations({ ...content, features: newLocations }));
      } catch (e) {
        console.log("error: ", e);
      } finally {
      }
    })();
  };

  useEffect(() => {
    addDistanceToGardens();
  }, []);

  return null;
};
export default UpdateLocation;
