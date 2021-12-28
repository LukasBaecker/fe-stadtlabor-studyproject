import Head from "next/head";
import React from "react";
import dynamic from "next/dynamic";
import Image from "react-bootstrap/Image";

export default function noAuthentification() {
  const language = "eng";
  return (
    <div className='errorWindow'>
      {language === "eng" ? (
        <>
          <h1>You have no rights to see this page.</h1>
          <p>please login to visit this page.</p>
        </>
      ) : language === "ger" ? (
        <>
          <h1>Keine Berechtigung für diesen Vorgang</h1>
          <p>Bitte melde dich an, um auf diese Seite zu gelangen.</p>
        </>
      ) : (
        <></>
      )}
      <Image src={"/imgs/authentification.svg"} className='notFoundImage' />
    </div>
  );
}
