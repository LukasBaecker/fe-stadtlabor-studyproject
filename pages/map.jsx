import Head from "next/head";
import React from "react";
import dynamic from "next/dynamic";
import Navigation from "../components/Navigation.jsx";
import MapNavigation from "../components/MapNav.jsx";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentPoint } from "../store/actions/index.js";
import { useEffect } from "react";
import { setCurrentUser } from "../store/actions/auth.js";
const Map = dynamic(() => import("../components/Map.jsx"), {
  ssr: false,
});

export default function mapPage() {
  const dispatch = useDispatch();
  const lang = useSelector((state) => state.lang);
  useEffect(() => {
    dispatch(setCurrentPoint(-1));
  }, []);
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
