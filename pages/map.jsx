import Head from "next/head";
import React from "react";
import dynamic from "next/dynamic";
import Navigation from "../components/Navigation.jsx";
const Map = dynamic(() => import("../components/Map.jsx"), {
  ssr: false,
});

export default function inicio() {
  return (
    <>
      <Head>
        <title>Map</title>
      </Head>
      <Navigation />
      <Map />
    </>
  );
}
