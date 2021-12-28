import Head from "next/head";
import React from "react";
import dynamic from "next/dynamic";
import Image from "react-bootstrap/Image";
const Map = dynamic(() => import("../components/Map.jsx"), {
  ssr: false,
});
import notFoundPic from "../public/imgs/404.svg";

export default function pageNotFound() {
  const language = "eng";
  return (
    <>
      <Head>
        <title>Page not found</title>
      </Head>
      <div className='errorWindow'>
        {language === "eng" ? (
          <>
            <h1>Ups! Seems, you digged to deep.</h1>
            <p>This page could not be found please return to our surface.</p>
          </>
        ) : language === "ger" ? (
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
        <Image src={"/imgs/404.svg"} className='notFoundImage' />
      </div>
    </>
  );
}
