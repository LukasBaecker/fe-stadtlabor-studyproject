import "../styles/globals.scss";
import "bootstrap/dist/css/bootstrap.css";

import Head from "next/head";
import React from "react";

function MyApp({ Component, pageProps }) {
  return (
    <React.Fragment>
      <title>GardenUp!</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <Component {...pageProps} />;
    </React.Fragment>
  );
}

export default MyApp;
