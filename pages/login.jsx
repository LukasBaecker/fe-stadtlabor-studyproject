import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Formik } from "formik";
import { useSelector } from "react-redux";
//import { message } from "antd";
let Yup = require("yup");
import { loginUser } from "../store/actions/auth.js";
import { useDispatch } from "react-redux";
import Alert from "react-bootstrap/Alert";
import Spinner from "../components/Spinner.jsx";

// Schema for yup
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("*enter a valid mail")
    .required("*please enter your email"),
  password: Yup.string().required("*please enter your password."),
});

const SignIn = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const router = useRouter();
  const currentUser = useSelector((state) => state.user);
  const [showError, setShowError] = useState(false);
  var getCrops = () => {
    router.push("/user");
  };

  return (
    <>
      <Head>
        <title>Sign In</title>
      </Head>
      {loading ? <Spinner /> : <></>}
      <div className='bodyBox'>
        <div
          style={{
            width: "80%",
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: "80px",
          }}>
          <h2>Sign in</h2>
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
              setLoading(true);
              setShowError(false);
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

                <Button
                  className='form-group'
                  variant='secondary'
                  type='submit'
                  disabled={isSubmitting}>
                  Login
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default SignIn;
