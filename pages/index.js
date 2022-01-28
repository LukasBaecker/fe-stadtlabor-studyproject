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
import LanguageSelector from "../components/LanguageSelector";
let Yup = require("yup");
import Navigation from "../components/Navigation.jsx";
import BootstrapButton from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { userLoginPostUrl } from "../helpers/urls";

import { useMediaQuery } from "react-responsive";

import styles from "../styles/Home.module.scss";

export default function Home() {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const [offsetY, setOffsetY] = useState(0);
  const router = useRouter();
  const lang = useSelector((state) => state.lang);
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
          <>
            <LanguageSelector />
            <LoginButton
              className={styles.loginButton}
              toggleLoginPopup={setLoginShown}
            />
          </>
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

        <SignupButton offsetY={offsetY} />
        <Advantages />

        {/* Login-Popup: Only visible if loginShown is True */}
        <LoginPopup isVisible={loginShown} toggleLoginPopup={setLoginShown} />

        <Container className={styles.siteElement}>
          <Image
            src='/imgs/anna-earl-Odhlx3-X0pI-unsplash.jpg'
            className={
              isTabletOrMobile
                ? styles.decoImage
                : `${styles.decoImage} ${styles.desktop}`
            }
          />
        </Container>
        <Container className={styles.siteElement}>
          <WhyJoin />
        </Container>
        <Container
          className={`${styles.siteElement} ${styles.linkButtonContainer}`}>
          <Row xs={1} md={2} className={styles.linkButtonRow}>
            <Col>
              <div className={styles.textCol}>
                <h2>
                  {lang === "eng"
                    ? "Explore the world of urban gardens"
                    : "Erkunde die Welt der urbanen Gärten"}
                </h2>
                <p>
                  {lang === "eng"
                    ? "The easiest and fastest way to find Urban Gardening projects in your area is to use our interactive map! Here you can not only see which projects are in your neighborhood, but also get an overview of their individual offer."
                    : "Die einfachste und schnellste Möglichkeit Urban Gardening Projekte in deiner Nähe zu finden, ist unsere interaktive Karte! Hier kannst du nicht nur sehen, welche Projekte es in deiner Nachbarschaft gibt, sondern erhältst auch einen Überblick über das jeweilige Angebot."}
                </p>
              </div>
            </Col>
            <Col>
              <LinkButton target={"map"} />
            </Col>
          </Row>
          <Row xs={1} md={2} className={styles.linkButtonRow}>
            <Col xs={{ order: 2 }} md={{ order: 1 }}>
              <LinkButton target={"cropvariety"} />
            </Col>
            <Col xs={{ order: 1 }} md={{ order: 2 }}>
              <div className={styles.textCol}>
                <h2>
                  {lang === "eng"
                    ? "Celebrate Crop Variety"
                    : "Pflanzenvielfalt neu erleben"}
                </h2>
                <p>
                  {lang === "eng"
                    ? "Scrolling through the most common crops might be inspiring. It also might simplify the choice of your favourite Urban Gardening project here at GardenUp. Get information about the crops and which garden is planting them"
                    : "Sich einen Überblick über häufige Pflanzen zu machen mag nicht nur inspirierend sein sondern auch die Wahl deines liebsten Urban Gardening Projects vereinfacht. Verschaffe dir einen Überblick und finde heraus in welchen Urban Gardens die jeweilige Pflanze angebaut wird."}
                </p>
              </div>
            </Col>
          </Row>
        </Container>
        <div className={styles.frontFooter}>
          <Image
            src='/imgs/dmitry-dreyer-gHho4FE4Ga0-unsplash.jpg'
            className={
              isTabletOrMobile
                ? styles.decoImageSecond
                : `${styles.decoImageSecond} ${styles.desktop}`
            }
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

function SignupButton(props) {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const lang = useSelector((state) => state.lang);
  const router = useRouter();

  function onSignupButtonClick() {
    router.push("/register");
  }
  return (
    <div className={styles.signup}>
      <Button
        variant='primary'
        onClick={() => onSignupButtonClick()}
        className={
          isTabletOrMobile
            ? props.offsetY < window.innerHeight * 0.6
              ? `${styles.signupButton} ${styles.smallerText}`
              : `${styles.signupButton} ${styles.fixedTop} ${styles.smallerText}`
            : props.offsetY < window.innerHeight * 0.6
            ? styles.signupButton
            : `${styles.signupButton} ${styles.fixedTop}`
        }>
        {props.offsetY < window.innerHeight * 0.6
          ? lang === "eng"
            ? "Sign up now!"
            : "Jetzt registrieren!"
          : ""}
        <Image src='/imgs/marker_white.svg' className={styles.signUpIcon} />
      </Button>
    </div>
  );
}
function LinkButton(props) {
  const lang = useSelector((state) => state.lang);
  const router = useRouter();

  return (
    <>
      <div
        className={styles.parent}
        onClick={() => router.push("/" + props.target)}>
        <div
          className={styles.buttonText}
          onClick={() => router.push("/" + props.target)}>
          <Image
            src={"/icons/arrow-pointer-solid.svg"}
            className={styles.cursorIcon}
          />
          click
          {/*props.target === "map"
              ? lang === "eng"
                ? "go to our map"
                : "schau dir unsere Karte an"
              : lang === "eng"
              ? "our crop variety"
        : "unsere Pflanzenvielfalt"*/}
        </div>
        <div
          className={
            props.target === "map"
              ? `${styles.child} ${styles.bgMap}`
              : `${styles.child} ${styles.bgCrop}`
          }></div>
      </div>
    </>
  );
}

function WhyJoin() {
  const lang = useSelector((state) => state.lang);
  return (
    <Container className={styles.WhyJoinElement}>
      <div className={styles.whyJoin}>
        <h2>{lang === "eng" ? "WHY JOIN?" : "WIESO BEITRETEN?"}</h2>
        {lang === "eng" ? (
          <p>
            Garden Up is the first plattform giving you the unique chance to get
            in contact with your local urban gardening projects or to share your
            own and become part of a greener world. Be a member of a social
            community of garden and plant lovers and experience mutual support.
            Share tools you like to lend, borrow things you do not have, share
            seeds others may need and even more.
          </p>
        ) : (
          <p>
            Garden Up ist die erste Plattform, die dir die einzigartige
            Möglichkeit bietet, mit lokalen Urban Gardening Projekten in Kontakt
            zu treten und Teil einer grüneren Welt zu werden. Werde Mitglied
            einer sozialen Gemeinschaft von Garten- und Pflanzenliebhaber*innen
            und erfahre gegenseitige Unterstützung. Teile Werkzeuge, die du
            verleihen möchtest, leihen Dinge von anderen, biete überschüssiges
            Saatgut an, bleib auf dem neusten Stand deiner Garten-Community und
            vieles mehr.
          </p>
        )}
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
  const lang = useSelector((state) => state.lang);
  const isAuth = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const router = useRouter();
  // Schema for yup
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("*enter a valid mail")
      .required("*please enter your email"),
    password: Yup.string().required("*please enter your password"),
  });
  // Schema for yup
  const validationSchemaGerman = Yup.object().shape({
    email: Yup.string()
      .email("*gib eine valide Mailadresse an")
      .required("*bitte gib deine Email an"),
    password: Yup.string().required("*bitte gib dein Passwort ein"),
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
                {lang === "eng" ? (
                  <p>Email or password is wrong.</p>
                ) : (
                  <p>Email oder Passwort ist falsch.</p>
                )}
              </Alert>
            </>
          ) : (
            <></>
          )}
          <Formik
            initialValues={{ email: "", password: "" }}
            // Hooks up our validationSchema to Formik
            validationSchema={
              lang === "eng" ? validationSchema : validationSchemaGerman
            }
            onSubmit={(values, { setSubmitting, resetForm }) => {
              setSubmitting(true);
              fetch(userLoginPostUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(values),
              })
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
                  <Form.Label>Email:</Form.Label>
                  <Form.Control
                    type='text'
                    name='email'
                    placeholder=''
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
                  <Form.Label>
                    {lang === "eng" ? "Password:" : "Passwort:"}
                  </Form.Label>
                  <Form.Control
                    type='password'
                    placeholder=''
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
  const lang = useSelector((state) => state.lang);
  const itemsEnglish = [
    {
      id: 1,
      url: "/imgs/icons8-hands.svg",
      text: "Connect with your local urban gardening community.",
    },
    {
      id: 2,
      url: "/imgs/icons8-shovel.svg",
      text: "Find useful tools in your local neighborhood and share yours.",
    },
    {
      id: 3,
      url: "/imgs/icons8-plant.svg",
      text: "Grow the urban garden together!",
    },
  ];
  const itemsGerman = [
    {
      id: 1,
      url: "/imgs/icons8-hands.svg",
      text: "Verbinde dich mit der Urban Gardening Community in deiner Stadt.",
    },
    {
      id: 2,
      url: "/imgs/icons8-shovel.svg",
      text: "Leihe nützliches Werkzeug und teile deines mit anderen Gärter*innen",
    },
    {
      id: 3,
      url: "/imgs/icons8-plant.svg",
      text: "Lasst uns gemeinsam die Welt grüner machen!",
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
        <h2>{lang === "eng" ? "WHAT IS GARDEN UP?" : "WAS IST GARDEN UP?"}</h2>
        <Container className={styles.advantagesContainer}>
          <Row xs={1} sm={3}>
            {lang === "eng"
              ? itemsEnglish.map((item) => (
                  <Col key={item.id}>
                    <AdvantagesItem url={item.url} text={item.text} />
                  </Col>
                ))
              : itemsGerman.map((item) => (
                  <Col key={item.id}>
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
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 767px)" });
  return (
    <Container
      className={
        isTabletOrMobile
          ? styles.advantagesCol
          : `${styles.advantagesCol} ${styles.desktop}`
      }>
      <Row xs={2} sm={1}>
        <Col xs={4} sm={12} className={styles.advantageText}>
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
  const lang = useSelector((state) => state.lang);
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 767px)" });
  return (
    <div id={styles.Footer}>
      <div className={styles.middleDiv} />
      <div className={styles.bottomDiv}>
        <a
          className={
            isTabletOrMobile
              ? styles.footerLink
              : `${styles.footerLink} ${styles.desktop}`
          }
          href='/about'>
          About
        </a>
        <a
          className={
            isTabletOrMobile
              ? styles.footerLink
              : `${styles.footerLink} ${styles.desktop}`
          }
          target='_blank'
          href={
            lang === "eng"
              ? "https://www.uni-muenster.de/de/en/datenschutzerklaerung.html"
              : "https://www.uni-muenster.de/de/datenschutzerklaerung.html"
          }>
          Privacy Policy
        </a>
      </div>
    </div>
  );
}
