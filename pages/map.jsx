import Head from "next/head";
import React from "react";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
import Navigation from "../components/Navigation.jsx";
import MapNavigation from "../components/MapNav.jsx";
import NotAuthenticated from "../components/NotAuthenticated.jsx";
const Map = dynamic(() => import("../components/Map.jsx"), {
  ssr: false,
});

export default function mapPage() {
  const currentUser = useSelector((state) => state.auth);
  return (
    <>
      <Head>
        <title>Map</title>
      </Head>
      {currentUser.isAuthenticated ? (
        <>
          <Navigation />
          <Map />
          <MapNavigation />
        </>
      ) : (
        <NotAuthenticated />
      )}
    </>
  );
}
