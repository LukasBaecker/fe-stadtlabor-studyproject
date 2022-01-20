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
function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(true);
  const [resourceFilter, setResourceFilter] = useState([]);
  const [gardensWithResources, setGardensWithResources] = useState([]);
  const pushResourceFilter = (element) => {
    {
      if (
        !resourceFilter.includes(element.resource_name) &&
        (!(typeof element === "string") ||
          !(element.resource_name instanceof String))
      ) {
        setResourceFilter(resourceFilter.push(element.resource_name));
      }
    }
  };
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      try {
        const req = await fetch(
          "http://giv-project15.uni-muenster.de:9000/api/v1/gardens/resources/all",
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        const cont = await req.json();
        dispatch(setResources(cont));
        cont.forEach((element) => {
          console.log("to be dispatched", element);
          pushResourceFilter(element);
        });
        const request = await fetch(
          "http://giv-project15.uni-muenster.de:9000/api/v1/gardens/all/",
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        const content = await request.json();
        if (content.detail === "Unauthenticated!") {
          dispatch(logoutUser());
          router.push("/login");
        } else {
          console.log(content);
          content.features.forEach((el) => {
            var garden = el;
            var resOfGarden = [];
            cont.forEach((r) => {
              if (r.garden === el.id) {
                resOfGarden.push(r.resource_id);
              }
            });
            garden = {
              ...el,
              properties: { ...el.properties, resources: resOfGarden },
            };
            setGardensWithResources(gardensWithResources.push(garden));
          });
          console.log("to be dispatched", gardensWithResources);
          dispatch(
            setFilteredLocations({ ...content, features: gardensWithResources })
          );
          dispatch(
            setGardenLocations({ ...content, features: gardensWithResources })
          );
        }
      } catch (e) {
        console.log("error: ", e);
      } finally {
        dispatch(setFilterCategories(resourceFilter));
        setLoading(false);
      }
    })();
  }, []);

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
