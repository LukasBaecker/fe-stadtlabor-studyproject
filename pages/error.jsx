import { useSelector } from "react-redux";
import Head from "next/head";
import Image from "react-bootstrap/Image";
//import the pictures

function Error({ center, zoom }) {
  const language = useSelector((state) => state.lang);
  return (
    <>
      <Head>
        <title>Page not found</title>
      </Head>
      <div className='errorWindow'>
        {language === "eng" ? (
          <>
            <h1>Ups! Seems, you digged to deep.</h1>
            <p>Please refresh the page to go on or try it again later.</p>
          </>
        ) : language === "ger" ? (
          <>
            <h1>Ups! Scheint, als hättest du zu tief gebuddelt.</h1>
            <p>
              Bitte lade die Seite neu, um fortzufahren oder versuche es zu
              einem späteren Zeitpunkt erneut.
            </p>
          </>
        ) : (
          <></>
        )}
        <Image src={"/imgs/error_primary.svg"} className='notFoundImage' />
      </div>
    </>
  );
}

export default Error;
