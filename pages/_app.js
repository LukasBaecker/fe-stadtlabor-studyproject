import "../styles/globals.scss";

import Head from "next/head";
import React, { useEffect, useState } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import {
  setGardenLocations,
  setFilteredLocations,
  setResources,
  setFilterCategories,
} from "../store/actions/gardenAndResources.js";
import { logoutUser } from "../store/actions/auth.js";
import { createWrapper } from "next-redux-wrapper";
import store from "../store/configurateStore.js";
import { PersistGate } from "redux-persist/integration/react";
import CenterSpinner from "../components/Loader.jsx";
import { userGetUrl } from "../helpers/urls";
function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      try {
        const request = await fetch(userGetUrl, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const content = await request.json();
        if (content.detail === "Unauthenticated!") {
          dispatch(logoutUser());
          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch (e) {
        console.log("error: ", e);
      }
    })();
  }, []);
  //TODO: general Error handler might be added here to catch every error happening while rendering the app to redirect to /error and inform the user with beauty about errors
  return (
    <React.Fragment>
      <title>GardenUp!</title>
      <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      <Provider store={store}>
        <PersistGate persistor={store.__PERSISTOR} loading={null}>
          {loading ? <CenterSpinner /> : <></>}
          <Component {...pageProps} />
        </PersistGate>
      </Provider>
    </React.Fragment>
  );
}
const makeStore = () => store;
const wrapper = createWrapper(makeStore);
export default wrapper.withRedux(MyApp);
