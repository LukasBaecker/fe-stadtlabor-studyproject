import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import router, { useRouter } from "next/router";
import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import { Formik } from "formik";
import { useDispatch } from "react-redux";
import { loginUser } from "../store/actions/auth.js";
import { setLanguage } from "../store/actions/index.js";
import { CenterSpinner } from "../components/Loader";
let Yup = require("yup");
import Navigation from "../components/Navigation.jsx";
import BootstrapButton from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSeedling, faTimes } from "@fortawesome/free-solid-svg-icons";

import { useMediaQuery } from "react-responsive";

import styles from "../styles/Home.module.scss";

export default function Home() {
  const [offsetY, setOffsetY] = useState(0);
  const router = useRouter();
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.auth.isAuthenticated);
  // Parallax Scroll Effect on Page Top
  const handleScroll = () => setOffsetY(window.scrollY);
  //get the height if the viewport
  let intViewportHeight = window.innerHeight;

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Boolean State indicating whether the Login Window is currently Shown
  const [loginShown, setLoginShown] = useState(false);

  return (
    <React.Fragment>
      <div className={styles.title}>
        {isAuth ? (
          <Navigation />
        ) : (
          <LoginButton
            className={styles.loginButton}
            toggleLoginPopup={setLoginShown}
          />
        )}

        {/* Page Title */}

        <Image
          id={styles.mainLogo}
          src='/garden.svg'
          style={{ transform: "translate(-50%, " + offsetY * 0.7 + "px)" }}
        />
        {/* Image of greenhouse in background */}
        <Image
          id={styles.mainBackground}
          src='/imgs/greenhouse.png'
          style={{ transform: "translateY(" + offsetY * -0.5 + "px)" }}
        />

        <SignupButton />
        <Advantages />

        {/* Login-Popup: Only visible if loginShown is True */}
        <LoginPopup isVisible={loginShown} toggleLoginPopup={setLoginShown} />

        <Container className={styles.siteElement}>
          <Image
            src='/imgs/dmitry-dreyer-gHho4FE4Ga0-unsplash.jpg'
            className={styles.decoImage}
          />
        </Container>

        <WhyJoin />

        <div className={styles.frontFooter}>
          <MapButton />
          <Image
            src='/imgs/anna-earl-Odhlx3-X0pI-unsplash.jpg'
            className={styles.decoImageSecond}
            fluid
          />
          <Footer />
        </div>
      </div>
    </React.Fragment>
  );
}

function LoginButton({ toggleLoginPopup }) {
  const dispatch = useDispatch();
  const lang = useSelector((state) => state.lang);
  function onLoginButtonClick() {
    toggleLoginPopup(true);
  }

  return (
    <>
      <Dropdown id='languageDropdown'>
        <Dropdown.Toggle variant='secondary' id='languageDropdownToggle'>
          {lang === "eng" ? "US" : "DE"}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={() => dispatch(setLanguage("eng"))}>
            English
          </Dropdown.Item>
          <Dropdown.Item onClick={() => dispatch(setLanguage("ger"))}>
            Deutsch
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <div className={styles.login}>
        <Button
          variant='secondary'
          className={styles.loginButton}
          onClick={() => onLoginButtonClick()}>
          Login
        </Button>
      </div>
    </>
  );
}

function SignupButton() {
  const lang = useSelector((state) => state.lang);
  const router = useRouter();
  function onSignupButtonClick() {
    router.push("/register");
  }

  return (
    <div className={styles.signup}>
      <button onClick={() => onSignupButtonClick()}>
        {lang === "eng" ? "Sign up now!" : "Jetzt registrieren!"}
        <Image src='/imgs/marker_white.svg' className={styles.signUpIcon} />
      </button>
    </div>
  );
}
function MapButton() {
  const lang = useSelector((state) => state.lang);
  const router = useRouter();
  function onMapButtonClick() {
    router.push("/map");
  }

  return (
    <div className={styles.mapButton}>
      <Button variant='primary' onClick={() => onMapButtonClick()}>
        {lang === "eng" ? "Go to our map" : "Schau dir unsere Karte an"}
      </Button>
    </div>
  );
}

function WhyJoin() {
  return (
    <Container className={styles.WhyJoinElement}>
      <div className={styles.whyJoin}>
        <h2>Why Join?</h2>
        Garden Up is the first plattform giving you the unique chance to get in
        contact with your local urban gardening projects or to share your own
        and become part of a greener world. Be a member of a social community of
        garden and plant lovers and experience mutual support. Share tools you
        like to lend, borrow things you do not have, share seeds others may need
        and even more.
      </div>
    </Container>
  );
}

// Popup that appears when a user clicks the Login Button
function LoginPopup({ isVisible, toggleLoginPopup }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);

  const isAuth = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const router = useRouter();
  // Schema for yup
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("*enter a valid mail")
      .required("*please enter your email"),
    password: Yup.string().required("*please enter your password."),
  });

  const onClose = () => toggleLoginPopup(false);
  if (isVisible) {
    return (
      <div className={styles.popup}>
        {loading ? <CenterSpinner /> : <></>}
        <div className={styles.popup_inner}>
          {showError ? (
            <>
              <Alert
                className='alertInPopup'
                variant='danger'
                onClose={() => setShowError(false)}
                dismissible>
                <Alert.Heading>Ups!</Alert.Heading>
                <p>Email or password is wrong.</p>
              </Alert>
            </>
          ) : (
            <></>
          )}
          <Formik
            initialValues={{ email: "", password: "" }}
            // Hooks up our validationSchema to Formik
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              setSubmitting(true);
              fetch(
                "http://giv-project15.uni-muenster.de:9000/api/v1/users/login",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  credentials: "include",
                  body: JSON.stringify(values),
                }
              )
                .then((res) => {
                  if (res.ok) {
                    res.json().then((result) => {
                      resetForm();
                      dispatch(loginUser(result.jwt));
                      console.log("Login: Success");
                      setLoading(true);
                      router.push("/user");
                    });
                  } else {
                    throw new Error("Something went wrong");
                  }
                })
                .catch((err) => {
                  resetForm();
                  setShowError(true);
                  console.log("Login: Denied");
                  console.log(err.message);
                });
            }}>
            {/* Callback function containing Formik state and helpers that handle common form actions */}
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <Form onSubmit={handleSubmit} className='mx-auto'>
                <Form.Group className='form-group' controlId='formEmail'>
                  <Form.Label>Email :</Form.Label>
                  <Form.Control
                    type='text'
                    name='email'
                    placeholder='Email'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                    className={
                      touched.email && errors.email ? "errorForm" : null
                    }
                  />
                  {touched.email && errors.email ? (
                    <div className='errorForm-message'>{errors.email}</div>
                  ) : null}
                </Form.Group>
                <Form.Group
                  className='form-group'
                  controlId='formBasicPassword'>
                  <Form.Label>Password :</Form.Label>
                  <Form.Control
                    type='password'
                    placeholder='Password'
                    name='password'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                    className={
                      touched.password && errors.password ? "errorForm" : null
                    }
                  />
                  {touched.password && errors.password ? (
                    <div className='errorForm-message'>{errors.password}</div>
                  ) : null}
                </Form.Group>

                <BootstrapButton
                  className='form-group'
                  variant='secondary'
                  type='submit'
                  disabled={isSubmitting}>
                  Login
                </BootstrapButton>
              </Form>
            )}
          </Formik>
          <button className={styles.popupCloseButton} onClick={() => onClose()}>
            <FontAwesomeIcon className={styles.closeIcon} icon={faTimes} />
          </button>
        </div>
      </div>
    );
  } else {
    return <React.Fragment />;
  }
}

//Component that lists the advantages with Images and texts
function Advantages() {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const items = [
    {
      id: 1,
      url: "/imgs/icons8-hands.svg",
      text: "Connect with your local urban gardening community",
    },
    {
      id: 2,
      url: "/imgs/icons8-shovel.svg",
      text: "Find useful tools in your local neighborhood and share yours",
    },
    {
      id: 3,
      url: "/imgs/icons8-plant.svg",
      text: "Grow the urban garden together",
    },
  ];
  return (
    <Container className={styles.firstSiteElement}>
      <div
        className={
          isTabletOrMobile
            ? styles.advantages
            : `${styles.advantages} ${styles.desktop}`
        }>
        <h2>Advantages of GardenUp</h2>
        <Container className={styles.advantagesContainer}>
          <Row xs={1} sm={3}>
            {items.map((item) => (
              <Col key={item.id} className={styles.advantagesCol}>
                <AdvantagesItem url={item.url} text={item.text} />
              </Col>
            ))}
          </Row>
        </Container>
      </div>
    </Container>
  );
}

// Component that shows one advantage: one image plus text
function AdvantagesItem({ url, text }) {
  return (
    <Container>
      <Row xs={2} sm={1}>
        <Col xs={4} sm={12}>
          <Image src={url} />
        </Col>
        <Col className={styles.advantageText} xs={8} sm={12}>
          {text}
        </Col>
      </Row>
    </Container>
  );
}

// Page Footer with About and Privacy Policy Links
function Footer() {
  return (
    <div id={styles.Footer}>
      <div className={styles.middleDiv} />
      <div className={styles.bottomDiv}>
        <a href='/about'>About</a>
        <a className={styles.privacy} href='/privacy'>
          Privacy Policy
        </a>
      </div>
    </div>
  );
}
