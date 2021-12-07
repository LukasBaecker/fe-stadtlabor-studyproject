import "../styles/globals.scss";

import Head from "next/head";
import React from "react";
import { Provider } from "react-redux";
import { createWrapper } from "next-redux-wrapper";
import store from "../store/configurateStore.js";

function MyApp({ Component, pageProps }) {
  return (
    <React.Fragment>
      <title>GardenUp!</title>
      <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </React.Fragment>
  );
}
const makeStore = () => store;
const wrapper = createWrapper(makeStore);
export default wrapper.withRedux(MyApp);
