import Head from "next/head";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import React from "react";
let Yup = require("yup");
import { Formik, Field } from "formik";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import styles from "../styles/signup.module.scss";
import { useMediaQuery } from "react-responsive";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import { CenterSpinner } from "../components/Loader";
import LanguageSelector from "../components/LanguageSelector";
import { userRegisterPostUrl } from "../helpers/urls";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-bootstrap/Modal";
//yup schema
const validationSchemaEN = Yup.object().shape({
  first_name: Yup.string()
    .min(2, "*names must have at least 2 characters")
    .max(30, "*names can't be longer than 30 characters")
    .required("*First name is required."),
  last_name: Yup.string()
    .min(2, "*names must have at least 2 characters")
    .max(30, "*names can't be longer than 30 characters")
    .required("*Last name is required."),
  email: Yup.string()
    .email("*must be a valid email address")
    .max(100, "*email must be less than 100 characters long")
    .required("Email is required."),
  password: Yup.string()
    .required("*Please enter a password.")
    .min(6, "*your password is too short - 6 charakters minimum"),
  repeatPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "*passwords do not match")
    .required("Please confirm your password.")
    .min(6, "*password is too short - 6 charakters minimum"),
  acceptTerms: Yup.boolean().oneOf(
    [true],
    "Please accept the terms and conditions"
  ),
});
const validationSchemaDE = Yup.object().shape({
  first_name: Yup.string()
    .min(2, "*Name muss mindestens 2 Zeichan lang sein")
    .max(30, "*Name darf nicht länger als 30 Zeichen sein")
    .required("*Name ist erforderlich"),
  last_name: Yup.string()
    .min(2, "*Name muss mindestens 2 Zeichan lang sein")
    .max(30, "*Name darf nicht länger als 30 Zeichen sein")
    .required("*Name ist erforderlich"),
  email: Yup.string()
    .email("*muss eine gültige Email-Adressen sein")
    .max(100, "*Email darf nicht länger als 100 Zeichen sein")
    .required("Email ist erforderlich"),
  password: Yup.string()
    .required("*Bitte Passwort eingeben.")
    .min(6, "*Passwort ist zu kurz - mindestens 6 Zeichen"),
  repeatPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "*Passwort stimmt nicht überein")
    .required("Bitte Passwort bestätigen")
    .min(6, "*Passwort ist zu kurz - mindestens 6 Zeichen"),
  acceptTerms: Yup.boolean().oneOf([true], "Bitte AGB akzeptieren"),
});

function signUp() {
  const lang = useSelector((state) => state.lang);
  const [show, setShow] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("An error has been occurred");
  const currentUser = useSelector((state) => state.auth);
  // Boolean State indicating whether the Login Window is currently Shown
  const [termsShown, setTermsShown] = useState(false);
  const router = useRouter();
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const redirecter = () => {
    router.push("/user");
    return <></>;
  };
  return (
    <>
      <Head>
        <title>{lang === "eng" ? "Sign Up!" : "Registrieren!"}</title>
      </Head>
      <LanguageSelector />
      {show ? (
        <>
          <Alert
            className="alertBox"
            variant="danger"
            onClose={() => setShow(false)}
            dismissible
          >
            <Alert.Heading>{lang === "eng" ? "Error" : "Fehler"}</Alert.Heading>
            <p>{message}</p>
          </Alert>
        </>
      ) : (
        <></>
      )}
      {/* make the multiple ALerts more flexible in the future to safe code */}
      {showSuccess ? (
        <>
          <CenterSpinner />
          <Alert className="alertBox" variant="primary">
            <Alert.Heading>
              {lang === "eng" ? "Congratulations" : "Herzlichen Glückwunsch"}
            </Alert.Heading>
            {lang === "eng" ? (
              <p>
                Your account has been created! You will be redirected shortly.
              </p>
            ) : (
              <p>
                Dein Account wurde erfolgreich erstellt! Du wirst in Kürze
                weitergeleitet.
              </p>
            )}
          </Alert>
        </>
      ) : (
        <></>
      )}
      {currentUser.isAuthenticated ? (
        redirecter()
      ) : (
        <Container className={styles.signupDiv}>
          <Row className={styles.test}>
            <Col className="form-div" xs={12} md={6}>
              <h2>{lang === "eng" ? "Registration" : "Registrieren"}</h2>
              <Formik
                initialValues={{
                  last_name: "",
                  first_name: "",
                  email: "",
                  password: "",
                  repeatPassword: "",
                  acceptTerms: false,
                }}
                // Hooks up our validationSchema to Formik
                validationSchema={
                  lang === "eng" ? validationSchemaEN : validationSchemaDE
                }
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  setShow(false);
                  // When button submits form and form is in the process of submitting, submit button is disabled
                  setSubmitting(true);

                  fetch(userRegisterPostUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({
                      first_name: values.first_name,
                      last_name: values.last_name,
                      email: values.email,
                      password: values.password,
                    }),
                  })
                    .then((res) => {
                      if (res.status == 200) {
                        res.json().then((result) => {
                          console.log(result);
                          setSubmitting(false);
                          setShowSuccess(true);
                          resetForm();
                          console.log(
                            result.first_name + " has been registered"
                          );
                          setTimeout(() => {
                            router.push("/login");
                          }, 5000);
                        });
                      } else {
                        res.json().then((result) => {
                          setSubmitting(false);
                          setMessage(result.email[0]);
                          setShow(true);
                        });
                      }
                    })
                    .catch((err) => {
                      setSubmitting(false);
                      console.log(err.message);
                    });
                }}
              >
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
                  <Form onSubmit={handleSubmit} className="mx-auto">
                    <Form.Group
                      className="form-group"
                      controlId="formFirstName"
                    >
                      <Form.Label>
                        {lang === "eng" ? "First Name :" : "Vorname :"}
                      </Form.Label>
                      <Form.Control
                        type="text"
                        /* This name property is used to access the value of the form element via values.nameOfElement */
                        name="first_name"
                        placeholder=""
                        /* Set onChange to handleChange */
                        onChange={handleChange}
                        /* Set onBlur to handleBlur */
                        onBlur={handleBlur}
                        /* Store the value of this input in values.name, make sure this is named the same as the name property on the form element */
                        value={values.first_name}
                        /* Check if the name field (this field) has been touched and if there is an error, if so add the .error class styles defined in the CSS (make the input box red) */
                        className={
                          touched.first_name && errors.first_name
                            ? "errorForm"
                            : null
                        }
                      />
                      {touched.first_name && errors.first_name ? (
                        <div className="errorForm-message">
                          {errors.first_name}
                        </div>
                      ) : null}
                    </Form.Group>
                    <Form.Group className="form-group" controlId="formSurname">
                      <Form.Label>
                        {lang === "eng" ? "Last Name :" : "Nachname :"}
                      </Form.Label>
                      <Form.Control
                        type="text"
                        /* This name property is used to access the value of the form element via values.nameOfElement */
                        name="last_name"
                        placeholder=""
                        /* Set onChange to handleChange */
                        onChange={handleChange}
                        /* Set onBlur to handleBlur */
                        onBlur={handleBlur}
                        /* Store the value of this input in values.name, make sure this is named the same as the name property on the form element */
                        value={values.last_name}
                        /* Check if the name field (this field) has been touched and if there is an error, if so add the .error class styles defined in the CSS (make the input box red) */
                        className={
                          touched.last_name && errors.last_name
                            ? "errorForm"
                            : null
                        }
                      />
                      {touched.last_name && errors.last_name ? (
                        <div className="errorForm-message">
                          {errors.last_name}
                        </div>
                      ) : null}
                    </Form.Group>
                    <Form.Group
                      className="form-group"
                      controlId="formEmail"
                      className="form-group"
                    >
                      <Form.Label>Email :</Form.Label>
                      <Form.Control
                        type="text"
                        name="email"
                        placeholder=""
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email}
                        className={
                          touched.email && errors.email ? "errorForm" : null
                        }
                      />
                      {touched.email && errors.email ? (
                        <div className="errorForm-message">{errors.email}</div>
                      ) : null}
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                      <Form.Label>
                        {lang === "eng" ? "Password :" : "Passwort :"}
                      </Form.Label>
                      <Form.Control
                        type="password"
                        placeholder=""
                        name="password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.password}
                        className={
                          touched.password && errors.password
                            ? "errorForm"
                            : null
                        }
                      />
                      {touched.password && errors.password ? (
                        <div className="errorForm-message">
                          {errors.password}
                        </div>
                      ) : null}
                    </Form.Group>
                    <Form.Group
                      className="form-group"
                      controlId="formRepeatPassword"
                    >
                      <Form.Label>
                        {lang === "eng"
                          ? "confirm Password :"
                          : "Passwort wiederholen :"}
                      </Form.Label>
                      <Form.Control
                        type="password"
                        placeholder=""
                        name="repeatPassword"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.repeatPassword}
                        className={
                          touched.repeatPassword && errors.repeatPassword
                            ? "errorForm"
                            : null
                        }
                      />
                      {touched.repeatPassword && errors.repeatPassword ? (
                        <div className="errorForm-message">
                          {errors.repeatPassword}
                        </div>
                      ) : null}
                    </Form.Group>
                    <Form.Group className="form-group" controlId="formTerms">
                      <Field
                        type="checkbox"
                        name="acceptTerms"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={
                          touched.acceptTerms && errors.acceptTerms
                            ? "errorForm"
                            : null
                        }
                      />
                      {lang === "eng" ? (
                        <Form.Label>
                          Yes, I have read the{" "}
                          <a onClick={() => setTermsShown(true)}>
                            terms and conditions
                          </a>
                          .
                        </Form.Label>
                      ) : (
                        <Form.Label>
                          Ja, ich habe die{" "}
                          <a onClick={() => setTermsShown(true)}>AGB</a> gelesen
                          und verstanden.
                        </Form.Label>
                      )}
                    </Form.Group>
                    <Button
                      className="form-group"
                      variant="primary"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {lang === "eng"
                        ? "Register your account"
                        : "Registrieren"}
                    </Button>
                  </Form>
                )}
              </Formik>
            </Col>
            <Col className={styles.imageDiv} xs={12} md={6}>
              <Image
                src="/imgs/jed-owen-1JgUGDdcWnM-unsplash.jpg"
                className={styles.img}
              />
            </Col>
          </Row>
        </Container>
      )}
      {termsShown ? (
        <div className="popup">
          <div className="popup_inner">
            <p>TEst</p>
            <button
              className="popupCloseButton"
              onClick={() => setTermsShown(false)}
            >
              <FontAwesomeIcon className="closeIcon" icon={faTimes} />
            </button>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

export default signUp;
