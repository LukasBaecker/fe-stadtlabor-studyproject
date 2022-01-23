import Head from "next/head";
import React from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Navigation from "../components/Navigation.jsx";
import MapNavigation from "../components/MapNav.jsx";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentPoint } from "../store/actions/index.js";
import { useEffect } from "react";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import { useMediaQuery } from "react-responsive";
const Map = dynamic(() => import("../components/Map.jsx"), {
  ssr: false,
});

export default function mapPage() {
  const dispatch = useDispatch();
  const lang = useSelector((state) => state.lang);
  const isAuth = useSelector((state) => state.auth.isAuthenticated);
  useEffect(() => {
    dispatch(setCurrentPoint(-1));
  }, []);
  return (
    <>
      <Head>
        <title>{lang === "eng" ? "Resource Map" : "Karte"}</title>
      </Head>
      <Navigation />
      {isAuth ? <></> : <SignupButton />}

      <Map />
      <MapNavigation />
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
