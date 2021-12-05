import Head from "next/head";
import React from "react";
let Yup = require("yup");
import { Formik } from "formik";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import styles from "../styles/signup.module.scss";
//yup schema
const validationSchema = Yup.object().shape({
  firstname: Yup.string()
    .min(2, "*names must have at least 2 characters")
    .max(30, "*names can't be longer than 30 characters")
    .required("*firstname is required"),
  surname: Yup.string()
    .min(2, "*names must have at least 2 characters")
    .max(30, "*names can't be longer than 30 characters")
    .required("*lastname is required"),
  email: Yup.string()
    .email("*must be a valid email address")
    .max(100, "*email must be less than 100 characters long")
    .required("*email is required"),
  phone: Yup.string()
    .email("*must be a valid phone number")
    .max(50, "*your phone number is to long")
    .required("*phone number is required"),
  password: Yup.string()
    .required("*please enter a password.")
    .min(6, "*your password is too short - 6 chars minimum"),
  repeatPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "*passwords do not match")
    .required("please confirm your password.")
    .min(6, "*password is too short - 6 charakters minimum"),
});

function signUp() {
  return (
    <>
      <Head>
        <title>Sign Up</title>
      </Head>
      <div className='form-div'>
        <h2>Registration</h2>
        <Formik
          initialValues={{
            surname: "",
            firstname: "",
            email: "",
            password: "",
            repeatPassword: "",
          }}
          // Hooks up our validationSchema to Formik
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            // When button submits form and form is in the process of submitting, submit button is disabled
            setSubmitting(true);
            axios
              .post("api/v1/user/register", null, {
                params: {
                  values,
                },
              })
              .then(() => {
                resetForm();
                setSubmitting(false);
                history.push("/success/newuser");
              })
              .catch((err) => {
                setSubmitting(false);
                console.log("err:", err.response);
                message.error(
                  "An error has been occured: " +
                    JSON.stringify(err.response.data.email)
                );
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
                <Form.Label>Surname :</Form.Label>
                <Form.Control
                  type='text'
                  /* This name property is used to access the value of the form element via values.nameOfElement */
                  name='surname'
                  placeholder=''
                  /* Set onChange to handleChange */
                  onChange={handleChange}
                  /* Set onBlur to handleBlur */
                  onBlur={handleBlur}
                  /* Store the value of this input in values.name, make sure this is named the same as the name property on the form element */
                  value={values.surname}
                  /* Check if the name field (this field) has been touched and if there is an error, if so add the .error class styles defined in the CSS (make the input box red) */
                  className={
                    touched.surname && errors.surname ? "errorForm" : null
                  }
                />
                {touched.surname && errors.surname ? (
                  <div className='errorForm-message'>{errors.surname}</div>
                ) : null}
              </Form.Group>
              <Form.Group className='form-group' controlId='formFirstName'>
                <Form.Label>First Name :</Form.Label>
                <Form.Control
                  type='text'
                  /* This name property is used to access the value of the form element via values.nameOfElement */
                  name='firstname'
                  placeholder=''
                  /* Set onChange to handleChange */
                  onChange={handleChange}
                  /* Set onBlur to handleBlur */
                  onBlur={handleBlur}
                  /* Store the value of this input in values.name, make sure this is named the same as the name property on the form element */
                  value={values.firstname}
                  /* Check if the name field (this field) has been touched and if there is an error, if so add the .error class styles defined in the CSS (make the input box red) */
                  className={
                    touched.firstname && errors.firstname ? "errorForm" : null
                  }
                />
                {touched.firstname && errors.firstname ? (
                  <div className='errorForm-message'>{errors.firstname}</div>
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
                  className={touched.email && errors.email ? "errorForm" : null}
                />
                {touched.email && errors.email ? (
                  <div className='errorForm-message'>{errors.email}</div>
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
                    touched.password && errors.password ? "errorForm" : null
                  }
                />
                {touched.password && errors.password ? (
                  <div className='errorForm-message'>{errors.password}</div>
                ) : null}
              </Form.Group>
              <Form.Group className='form-group' controlId='formRepeatPassword'>
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
      </div>
      <div className={styles.imageDiv}>
        <Image
          src='/imgs/jed-owen-1JgUGDdcWnM-unsplash.jpg'
          className={styles.img}
        />
      </div>
    </>
  );
}

export default signUp;
