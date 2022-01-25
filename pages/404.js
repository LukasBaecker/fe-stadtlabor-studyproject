import Head from "next/head";
import React from "react";
import Image from "react-bootstrap/Image";
import LanguageSelector from "../components/LanguageSelector";
import { useSelector } from "react-redux";

export default function pageNotFound() {
  const lang = useSelector((state) => state.lang);
  return (
    <>
      <Head>
        {lang === "eng" ? (
          <title>Page not found</title>
        ) : (
          <title>Seite nicht gefunden</title>
        )}
      </Head>
      <LanguageSelector />
      <div className="errorWindow">
        {lang === "eng" ? (
          <>
            <h1>Ups! Seems, you digged to deep.</h1>
            <p>This page could not be found please return to our surface.</p>
          </>
        ) : lang === "ger" ? (
          <>
            <h1>Ups! Scheint, als hättest du zu tief gebuddelt.</h1>
            <p>
              Diese Seite konnte nicht gefunden werden. Kehre bitte an unsere
              Oberfläche zurück.
            </p>
          </>
        ) : (
          <></>
        )}
        <Image src={"/imgs/404.svg"} className="notFoundImage" />
      </div>
    </>
  );
}
