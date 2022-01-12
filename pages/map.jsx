import Head from "next/head";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import dynamic from "next/dynamic";
import Navigation from "../components/Navigation.jsx";
import MapNavigation from "../components/MapNav.jsx";
import NotAuthenticated from "../components/NotAuthenticated.jsx";
import {
  setGardenLocations,
  setFilteredLocations,
  setResources,
  setFilterCategories,
} from "../store/actions/gardenAndResources.js";
import CenterSpinner from "../components/Loader.jsx";
import { logoutUser } from "../store/actions/auth.js";

const Map = dynamic(() => import("../components/Map.jsx"), {
  ssr: false,
});

export default function mapPage() {
  const resources = useSelector((state) => state.resources);
  const [locations, setLocations] = useState({});
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const [resourceFilter, setResourceFilter] = useState([]);
  const [gardensWithResources, setGardensWithResources] = useState([]);
  const pushResourceFilter = (element) => {
    {
      if (
        !resourceFilter.includes(element.resource_name) &&
        (!(typeof element === "string") ||
          !(element.resource_name instanceof String))
      ) {
        setResourceFilter(resourceFilter.push(element.resource_name));
      }
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const request = await fetch(
          "http://giv-project15.uni-muenster.de:9000/api/v1/gardens/all/",
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        const content = await request.json();
        if (content.detail === "Unauthenticated!") {
          dispatch(logoutUser());
          router.push("/login");
        } else {
          setLocations(content);
          //dispatch(setGardenLocations(content));
          dispatch(setFilteredLocations(content));
          setLoading(false);

          content.features.forEach((el) => {
            var garden = el;
            var resOfGarden = [];
            resources.forEach((r) => {
              if (r.garden === el.id) {
                resOfGarden.push(r.resource_id);
              }
            });
            garden = {
              ...el,
              properties: { ...el.properties, resources: resOfGarden },
            };
            setGardensWithResources(gardensWithResources.push(garden));
          });
          console.log(gardensWithResources);
          dispatch(
            setGardenLocations({ ...content, features: gardensWithResources })
          );
        }

        const req = await fetch(
          "http://giv-project15.uni-muenster.de:9000/api/v1/gardens/resources/all",
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        const cont = await req.json();
        dispatch(setResources(cont));
      } catch (e) {
        console.log("error: ", e);
      } finally {
        try {
          resources.forEach((element) => pushResourceFilter(element));
        } catch (e) {
          console.log("error: ", e);
        } finally {
          dispatch(setFilterCategories(resourceFilter));
          setLoading(false);
        }
      }
    })();
  }, []);
  const content = () => {
    return (
      <>
        <Navigation />
        <Map />
        <MapNavigation />
      </>
    );
  };

  return (
    <>
      <Head>
        <title>Map</title>
      </Head>
      {loading ? <CenterSpinner /> : content()}
    </>
  );
}
