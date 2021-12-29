import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import router, { useRouter } from "next/router";
import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import { Formik } from "formik";
import { loginUser } from "../store/actions/auth.js";
import { useDispatch } from "react-redux";
let Yup = require("yup");
import BootstrapButton from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSeedling, faTimes } from "@fortawesome/free-solid-svg-icons";

import styles from "../styles/Home.module.scss";

export default function Home() {
  const router = useRouter();
  const [offsetY, setOffsetY] = useState(0);
  const currentUser = useSelector((state) => state.auth);
  // Parallax Scroll Effect on Page Top
  const handleScroll = () => setOffsetY(window.scrollY);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Boolean State indicating whether the Login Window is currently Shown
  const [loginShown, setLoginShown] = useState(false);
  const content = () => {
    return (
      <React.Fragment>
        <div className='bodyBox'>
          <div className={styles.title}>
            <LoginButton offsetY={offsetY} toggleLoginPopup={setLoginShown} />
            {/* Page Title */}
            <h1
              style={{ transform: "translate(-50%, " + offsetY * 0.5 + "px)" }}>
              GardenUp!
            </h1>

            {/* Image of greenhouse in background */}
            <Image
              src='/imgs/greenhouse.png'
              style={{ transform: "translateY(" + offsetY * 0.5 + "px)" }}
            />

            <SignupButton />
            <WhyJoin />
          </div>

          {/* Login-Popup: Only visible if loginShown is True */}
          <LoginPopup isVisible={loginShown} toggleLoginPopup={setLoginShown} />

          <Container className={styles.siteElement}>
            <Image
              src='/imgs/dmitry-dreyer-gHho4FE4Ga0-unsplash.jpg'
              className={styles.decoImage}
            />
          </Container>

          <Advantages />

          <div className={styles.frontFooter}>
            <SignupButton />
            <Image
              src='/imgs/anna-earl-Odhlx3-X0pI-unsplash.jpg'
              className={styles.decoImage}
              fluid
            />
            <Footer />
          </div>
        </div>
      </React.Fragment>
    );
  };
  const redirecter = () => {
    router.push("/user");
    return <></>;
  };
  return <>{currentUser.isAuthenticated ? redirecter() : content()}</>;
}

function LoginButton({ offsetY, toggleLoginPopup }) {
  function onLoginButtonClick() {
    toggleLoginPopup(true);
  }

  return (
    <div className={styles.login}>
      <button
        onClick={() => onLoginButtonClick()}
        style={{ transform: "translateY(" + offsetY * 0.5 + "px)" }}>
        Log in!
      </button>
    </div>
  );
}

function SignupButton() {
  const router = useRouter();
  function onSignupButtonClick() {
    router.push("/register");
  }

  return (
    <div className={styles.signup}>
      <button onClick={() => onSignupButtonClick()}>
        Sign up!
        <FontAwesomeIcon className={styles.signUpIcon} icon={faSeedling} />
      </button>
    </div>
  );
}

function WhyJoin() {
  return (
    <Container className={styles.WhyJoinElement}>
      <div className={styles.whyJoin}>
        <h2>Why Join?</h2>
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
        eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
        voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
        clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
        amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
        nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
        sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
        rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem
        ipsum dolor sit amet.
      </div>
    </Container>
  );
}

// Popup that appears when a user clicks the Login Button
function LoginPopup({ isVisible, toggleLoginPopup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);
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
  const items = [
    {
      id: 1,
      url: "/imgs/icons8-hands-60 1.png",
      text: "Connect with your local urban gardening community",
    },
    {
      id: 2,
      url: "/imgs/icons8-shovel-50 1.png",
      text: "Find useful tools in your local neighborhood and share yours",
    },
    {
      id: 3,
      url: "/imgs/icons8-plant-60.png",
      text: "Grow the urban garden together",
    },
  ];
  return (
    <Container className={styles.siteElement}>
      <div className={styles.advantages}>
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
        About <br /> Privacy Policy
      </div>
    </div>
  );
}
