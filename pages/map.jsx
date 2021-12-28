import Head from "next/head";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import dynamic from "next/dynamic";
import Navigation from "../components/Navigation.jsx";
import MapNavigation from "../components/MapNav.jsx";
import NotAuthenticated from "../components/NotAuthenticated.jsx";
import {
  setGardenLocations,
  setResources,
} from "../store/actions/gardenAndResources.js";
import Spinner from "react-bootstrap/Spinner";

const Map = dynamic(() => import("../components/Map.jsx"), {
  ssr: false,
});

export default function mapPage() {
  const currentUser = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        const request = await fetch(
          "http://giv-project15.uni-muenster.de:9000/api/v1/gardens/all",
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        const content = await request.json();
        dispatch(setGardenLocations(content));
      } catch (e) {
        console.log("error: ", e);
      } finally {
        setLoading(false);
      }
      try {
        const request = await fetch(
          "http://giv-project15.uni-muenster.de:9000/api/v1/gardens/resources/all",
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        const content = await request.json();
        dispatch(setResources(content));
      } catch (e) {
        console.log("error: ", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const spinner = () => {
    return (
      <div className='spinnerDiv'>
        <Spinner animation='border' role='status' variant='secondary'></Spinner>
      </div>
    );
  };
  const content = () => {
    return currentUser.isAuthenticated ? (
      <>
        <Navigation />
        <Map />
        <MapNavigation />
      </>
    ) : (
      <NotAuthenticated />
    );
  };

  return (
    <>
      <Head>
        <title>Map</title>
      </Head>
      {loading ? spinner() : content()}
    </>
  );
}
