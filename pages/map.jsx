import Head from "next/head";
import React from "react";
import dynamic from "next/dynamic";
import Navigation from "../components/Navigation.jsx";
import MapNavigation from "../components/MapNav.jsx";
import { useSelector } from "react-redux";
const Map = dynamic(() => import("../components/Map.jsx"), {
  ssr: false,
});

export default function mapPage() {
  const lang = useSelector((state) => state.lang);
  return (
    <>
      <Head>
        <title>{lang === "eng" ? "Resource Map" : "Karte"}</title>
      </Head>
      <Navigation />
      <Map />
      <MapNavigation />
    </>
  );
}
