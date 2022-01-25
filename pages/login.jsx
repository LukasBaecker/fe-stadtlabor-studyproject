import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Formik } from "formik";
//import { message } from "antd";
let Yup = require("yup");
import { loginUser } from "../store/actions/auth.js";
import { useDispatch, useSelector } from "react-redux";
import Alert from "react-bootstrap/Alert";
import CenterSpinner from "../components/Loader.jsx";
import Navigation from "../components/Navigation.jsx";
import { userLoginPostUrl } from "../helpers/urls";

// Schema for yup
const validationSchemaEN = Yup.object().shape({
  email: Yup.string()
    .email("*enter a valid mail")
    .required("*please enter your email"),
  password: Yup.string().required("*please enter your password."),
});
const validationSchemaDE = Yup.object().shape({
  email: Yup.string()
    .email("*Valide Email-Adresse eingeben")
    .required("*Bitte Email-Adresse eingeben"),
  password: Yup.string().required("*Bitte Password eingeben"),
});

const SignIn = () => {
  const lang = useSelector((state) => state.lang);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const currentUser = useSelector((state) => state.auth);
  const [showError, setShowError] = useState(false);

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      {loading ? <CenterSpinner /> : <></>}
      {currentUser.isAuthenticated ? (
        () => {
          router.push("/user");
        }
      ) : (
        <>
          <Navigation />
          <div className="bodyBox">
            <div
              style={{
                width: "80%",
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: "80px",
              }}
            >
              <h2>{lang === "eng" ? "Sign in" : "Anmelden"}</h2>
              {showError ? (
                <>
                  <Alert
                    className="alertInPopup"
                    variant="danger"
                    onClose={() => setShowError(false)}
                    dismissible
                  >
                    <Alert.Heading>Ups!</Alert.Heading>
                    {lang === "eng" ? (
                      <p>Email or password is wrong.</p>
                    ) : (
                      <p>Email oder passwort ist falsch.</p>
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
                  lang === "eng" ? validationSchemaEN : validationSchemaDE
                }
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  setLoading(true);
                  setShowError(false);
                  setSubmitting(true);
                  fetch(userLoginPostUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify(values),
                  })
                    .then((res) => {
                      if (res.status == 200) {
                        res.json().then((result) => {
                          resetForm();
                          dispatch(loginUser(result.jwt));
                          console.log("Login: Success");
                          router.push("/user");
                        });
                      } else {
                        setLoading(false);
                        throw new Error("Something went wrong");
                      }
                    })
                    .catch((err) => {
                      resetForm();
                      setShowError(true);
                      console.log("Login: Denied");
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
                    <Form.Group className="form-group" controlId="formEmail">
                      <Form.Label>Email :</Form.Label>
                      <Form.Control
                        type="text"
                        name="email"
                        placeholder="Email"
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
                    <Form.Group
                      className="form-group"
                      controlId="formBasicPassword"
                    >
                      <Form.Label>
                        {lang === "eng" ? "Password" : "Passwort"} :
                      </Form.Label>
                      <Form.Control
                        type="password"
                        placeholder={lang === "eng" ? "Password" : "Passwort"}
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

                    <Button
                      className="form-group"
                      variant="secondary"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      Login
                    </Button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SignIn;
