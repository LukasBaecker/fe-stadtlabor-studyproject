import Head from "next/head";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Navigation from "../components/Navigation.jsx";
import MapNavigation from "../components/MapNav.jsx";
import { CenterSpinner } from "../components/Loader.jsx";
import { useSelector, useDispatch } from "react-redux";
import {
  setGardenLocations,
  setFilteredLocations,
  setResources,
  setFilterCategories,
} from "../store/actions/gardenAndResources.js";
import { setCurrentPoint } from "../store/actions/index.js";
import logoutUser from "../store/actions/auth.js";
import { useEffect } from "react";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import { useMediaQuery } from "react-responsive";
import {
  resourcesGetUrl,
  userGetUrl,
  getAllGardens,
} from "../helpers/urls.jsx";
const Map = dynamic(() => import("../components/Map.jsx"), {
  ssr: false,
});

export default function mapPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const dispatch = useDispatch();
  const lang = useSelector((state) => state.lang);
  const isAuth = useSelector((state) => state.auth.isAuthenticated);
  const [resourceFilter, setResourceFilter] = useState([]);
  const [user, setUser] = useState({});
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
  useEffect(() => {
    dispatch(setCurrentPoint(-1));
    (async () => {
      //TODO: put this request back to the map page because it is just important for the map page
      //TODO: make a user request to the backend to update the auth store ting and set it then as true or false
      //TODO: hier noch die User daten fetchen damit man dann im MapNav und im Marker checken kann ob der User bereits im Garten ist und der Join Button angezeigt werden kann oder nicht
      try {
        const userRequest = await fetch(userGetUrl, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const userInformation = await userRequest.json();
        if (userInformation.detail === "Unauthenticated!") {
          if (isAuth) {
            dispatch(logoutUser());
          }
        } else {
          setUser(userInformation);
        }
        const req = await fetch(resourcesGetUrl, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const cont = await req.json();
        dispatch(setResources(cont));
        cont.forEach((element) => {
          pushResourceFilter(element);
        });
        const request = await fetch(getAllGardens, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const content = await request.json();
        if (content.detail === "Unauthenticated!") {
          dispatch(logoutUser());
          router.push("/login");
        } else {
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

        console.log("test");
        setLoading(false);
      }
    })();
  }, []);
  return (
    <>
      <Head>
        <title>{lang === "eng" ? "Resource Map" : "Karte"}</title>
      </Head>
      <Navigation />
      {isAuth ? <></> : <SignupButton />}
      {loading ? <CenterSpinner /> : <></>}
      <Map user={user} />
      <MapNavigation user={user} />
    </>
  );
}

function SignupButton() {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const lang = useSelector((state) => state.lang);
  const router = useRouter();

  function onSignupButtonClick() {
    router.push("/register");
  }
  return (
    <div className='signUpButtonDivMap'>
      <Button
        variant='primary'
        onClick={() => onSignupButtonClick()}
        className={
          isTabletOrMobile
            ? "signupButtonMap smallerTextMap"
            : "signupButtonMap"
        }>
        {lang === "eng"
          ? isTabletOrMobile
            ? "Sign up!"
            : "Sign up now!"
          : isTabletOrMobile
          ? "Registrieren!"
          : "Jetzt registrieren!"}
        <Image src='/imgs/marker_white.svg' className='signUpIconMap' />
      </Button>
    </div>
  );
}
