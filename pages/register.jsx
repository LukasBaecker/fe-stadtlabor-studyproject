import Head from "next/head";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import React from "react";
let Yup = require("yup");
import { Formik } from "formik";
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

//yup schema
const validationSchema = Yup.object().shape({
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
  contact: Yup.string()
    .max(50, "*your phone number is to long")
    .required("*Phone number is required."),
  password: Yup.string()
    .required("*Please enter a password.")
    .min(6, "*your password is too short - 6 charakters minimum"),
  repeatPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "*passwords do not match")
    .required("Please confirm your password.")
    .min(6, "*password is too short - 6 charakters minimum"),
});

function signUp() {
  const [show, setShow] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("An error has been occurred");
  const currentUser = useSelector((state) => state.auth);
  const router = useRouter();
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 767px)" });

  return (
    <>
      <Head>
        <title>Sign Up</title>
      </Head>
      {show ? (
        <>
          <Alert
            className='alertBox'
            variant='danger'
            onClose={() => setShow(false)}
            dismissible>
            <Alert.Heading>Error</Alert.Heading>
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
          <Alert className='alertBox' variant='primary'>
            <Alert.Heading>Congratulation</Alert.Heading>
            <p>
              Your account has been created! You will be redirected shortly.
            </p>
          </Alert>
        </>
      ) : (
        <></>
      )}
      {currentUser.isAuthenticated ? (
        () => {
          router.push("/user");
        }
      ) : (
        <Container className={styles.signupDiv}>
          <Row className={styles.test}>
            <Col className='form-div' xs={12} md={6}>
              <h2>Registration</h2>
              <Formik
                initialValues={{
                  last_name: "",
                  first_name: "",
                  email: "",
                  password: "",
                  contact: "",
                  repeatPassword: "",
                }}
                // Hooks up our validationSchema to Formik
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  setShow(false);
                  // When button submits form and form is in the process of submitting, submit button is disabled
                  setSubmitting(true);

                  fetch(
                    "http://giv-project15.uni-muenster.de:9000/api/v1/users/register",
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      credentials: "include",
                      body: JSON.stringify({
                        first_name: values.first_name,
                        last_name: values.last_name,
                        email: values.email,
                        password: values.password,
                        phone: values.contact,
                      }),
                    }
                  )
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
                    <Form.Group className='form-group' controlId='formSurname'>
                      <Form.Label>Last Name :</Form.Label>
                      <Form.Control
                        type='text'
                        /* This name property is used to access the value of the form element via values.nameOfElement */
                        name='last_name'
                        placeholder=''
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
                        <div className='errorForm-message'>
                          {errors.last_name}
                        </div>
                      ) : null}
                    </Form.Group>
                    <Form.Group
                      className='form-group'
                      controlId='formFirstName'>
                      <Form.Label>First Name :</Form.Label>
                      <Form.Control
                        type='text'
                        /* This name property is used to access the value of the form element via values.nameOfElement */
                        name='first_name'
                        placeholder=''
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
                        <div className='errorForm-message'>
                          {errors.first_name}
                        </div>
                      ) : null}
                    </Form.Group>
                    <Form.Group
                      className='form-group'
                      controlId='formEmail'
                      className='form-group'>
                      <Form.Label>Email :</Form.Label>
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
                    <Form.Group className='form-group' controlId='formContact'>
                      <Form.Label>Phone Number:</Form.Label>
                      <Form.Control
                        type='text'
                        /* This name property is used to access the value of the form element via values.nameOfElement */
                        name='contact'
                        placeholder=''
                        /* Set onChange to handleChange */
                        onChange={handleChange}
                        /* Set onBlur to handleBlur */
                        onBlur={handleBlur}
                        /* Store the value of this input in values.name, make sure this is named the same as the name property on the form element */
                        value={values.contact}
                        /* Check if the name field (this field) has been touched and if there is an error, if so add the .error class styles defined in the CSS (make the input box red) */
                        className={
                          touched.contact && errors.contact ? "errorForm" : null
                        }
                      />
                      {touched.contact && errors.contact ? (
                        <div className='errorForm-message'>
                          {errors.contact}
                        </div>
                      ) : null}
                    </Form.Group>
                    <Form.Group controlId='formBasicPassword'>
                      <Form.Label>Password :</Form.Label>
                      <Form.Control
                        type='password'
                        placeholder=''
                        name='password'
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
                        <div className='errorForm-message'>
                          {errors.password}
                        </div>
                      ) : null}
                    </Form.Group>
                    <Form.Group
                      className='form-group'
                      controlId='formRepeatPassword'>
                      <Form.Label>confirm Password :</Form.Label>
                      <Form.Control
                        type='password'
                        placeholder=''
                        name='repeatPassword'
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
                        <div className='errorForm-message'>
                          {errors.repeatPassword}
                        </div>
                      ) : null}
                    </Form.Group>

                    <Button
                      className='form-group'
                      variant='primary'
                      type='submit'
                      disabled={isSubmitting}>
                      Register your account
                    </Button>
                  </Form>
                )}
              </Formik>
            </Col>
            <Col className={styles.imageDiv} xs={12} md={6}>
              <Image
                src='/imgs/jed-owen-1JgUGDdcWnM-unsplash.jpg'
                className={styles.img}
              />
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
}

export default signUp;
