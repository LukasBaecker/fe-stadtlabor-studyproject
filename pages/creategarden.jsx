import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { logoutUser } from "../store/actions/auth";
import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Formik } from "formik";
import { useSelector } from "react-redux";
import Navigation from "../components/Navigation";
import { CenterSpinner } from "../components/Loader";
import {
  createGarden,
  joinGarden,
  deleteGarden,
} from "../helpers/manageGarden";
import { userGetUrl } from "../helpers/urls";
//import { message } from "antd";
let Yup = require("yup");
import { loginUser } from "../store/actions/auth.js";
import Alert from "react-bootstrap/Alert";

// Schema for yup
const validationSchema = Yup.object().shape({
  latitude: Yup.number("Must be a number")
    .min(-90, "Number too small, must be larger than -90")
    .max(90, "Number too high, must be smaller than 90")
    .typeError("Must be a number"),
  longitude: Yup.number()
    .min(-180, "Number too small, must be larger than -180")
    .max(180, "Number too high, must be smaller than 180")
    .typeError("Must be a number"),
  name: Yup.string().required("Please enter the name of the garden"),
  description: Yup.string().required(
    "Please enter a description of the garden"
  ),
  phone: Yup.number().typeError("Please enter a phone number"),
  address: Yup.string().typeError("Please enter an address"),
  email: Yup.string()
    .email("*enter a valid mail")
    .required("*please enter a garden contact email"),
});

const CreateGarden = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErorrMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    (async () => {
      try {
        // Check if user is authenticated
        const request = await fetch(userGetUrl, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const content = await request.json();
        if (content.detail === "Unauthenticated!") {
          console.log("unauthenticated");
          dispatch(logoutUser());
          router.push("/login");
        } else {
          setUserDetails(content);
          setLoading(false);
        }
      } catch (e) {
        console.log("error: ", e);
      }
    })();
  }, []);

  const Content = () => {
    return (
      <>
        <Head>
          <title>New Garden</title>
        </Head>
        <div className="bodyBox">
          <Navigation />
          <div
            style={{
              width: "80%",
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: "80px",
            }}
          >
            <h2>New Garden</h2>
            {showError ? (
              <ErrorMessage
                setShowError={setShowError}
                message={errorMessage}
              />
            ) : (
              <></>
            )}
            <Formik
              initialValues={{
                latitude: "",
                longitude: "",
                geom_point: "",
                name: "",
                description: "",
                email: "",
                phone: "",
                address: "",
                crops: [],
                members: [],
                primary_purpose: "RESOURCES",
              }}
              // Hooks up our validationSchema to Formik
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                setLoading(true);
                setShowError(false);
                setSubmitting(true);

                values["geom_point"] =
                  "POINT(" + values.longitude + " " + values.latitude + ")";

                /*
                Two-step process:
                1st step: Call garden-api by POST to create instance of the garden
                2nd step: Call user-api by PUT to link user to newly created garden
                If 2nd step fails, try to delete garden.
                */
                try {
                  const gardenId = await createGarden(values);

                  if (gardenId != -1) {
                    const joinedGarden = await joinGarden(
                      userDetails,
                      gardenId
                    );

                    if (joinedGarden) {
                      router.push("/garden/" + gardenId + "/");
                    } else {
                      const gardenDeleted = await deleteGarden(gardenId);

                      if (gardenDeleted) {
                        throw new Error(
                          "Something went wrong registering the user in the garden. So garden was deleted."
                        );
                      } else {
                        throw new Error(
                          "Something went wrong registering the user in the garden.\
                                  The Garden was tried to be deleted, but failed.\
                                  The Garden has the ID " +
                            gardenId
                        );
                      }
                    }
                  } else {
                    throw new Error("Something went wrong creating the garden");
                  }
                } catch (err) {
                  setLoading(false);
                  setErorrMessage(err.message);
                  setShowError(true);
                }
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
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="Name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.name}
                      className={
                        touched.name && errors.name ? "errorForm" : null
                      }
                    />
                    {touched.name && errors.name ? (
                      <div className="errorForm-message">{errors.name}</div>
                    ) : null}
                  </Form.Group>

                  <Form.Group className="form-group" controlId="formEmail">
                    <Form.Label>Latitude</Form.Label>
                    <Form.Control
                      type="text"
                      name="latitude"
                      placeholder="Latitude"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.latitude}
                      className={
                        touched.latitude && errors.latitude ? "errorForm" : null
                      }
                    />
                    {touched.latitude && errors.latitude ? (
                      <div className="errorForm-message">{errors.latitude}</div>
                    ) : null}
                  </Form.Group>

                  <Form.Group className="form-group" controlId="formEmail">
                    <Form.Label>Longitude</Form.Label>
                    <Form.Control
                      type="text"
                      name="longitude"
                      placeholder="Longitude"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.longitude}
                      className={
                        touched.longitude && errors.longitude
                          ? "errorForm"
                          : null
                      }
                    />
                    {touched.longitude && errors.longitude ? (
                      <div className="errorForm-message">
                        {errors.longitude}
                      </div>
                    ) : null}
                  </Form.Group>

                  <Form.Group className="form-group" controlId="formEmail">
                    <Form.Label>Email</Form.Label>
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

                  <Form.Group className="form-group" controlId="formEmail">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="text"
                      name="phone"
                      placeholder="Phone"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.phone}
                      className={
                        touched.phone && errors.phone ? "errorForm" : null
                      }
                    />
                    {touched.phone && errors.phone ? (
                      <div className="errorForm-message">{errors.phone}</div>
                    ) : null}
                  </Form.Group>

                  <Form.Group className="form-group" controlId="formEmail">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      placeholder="Address"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.address}
                      className={
                        touched.address && errors.address ? "errorForm" : null
                      }
                    />
                    {touched.address && errors.address ? (
                      <div className="errorForm-message">{errors.address}</div>
                    ) : null}
                  </Form.Group>

                  <Form.Group className="form-group" controlId="formEmail">
                    <Form.Label>Primary Purpose</Form.Label>
                    <Form.Select
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.primary_purpose}
                      className={
                        touched.primary_purpose && errors.primary_purpose
                          ? "errorForm"
                          : null
                      }
                    >
                      <option value="RESOURCES">Ressource Sharing</option>
                      <option value="GARDEN">Community Garden</option>
                    </Form.Select>
                    {touched.primary_purpose && errors.primary_purpose ? (
                      <div className="errorForm-message">
                        {errors.primary_purpose}
                      </div>
                    ) : null}
                  </Form.Group>

                  <Form.Group className="form-group" controlId="formEmail">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="description"
                      placeholder="Description"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.description}
                      className={
                        touched.description && errors.description
                          ? "errorForm"
                          : null
                      }
                    />
                    {touched.description && errors.description ? (
                      <div className="errorForm-message">
                        {errors.description}
                      </div>
                    ) : null}
                  </Form.Group>

                  <Button
                    className="form-group"
                    variant="secondary"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Create Garden
                  </Button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </>
    );
  };
  return <>{loading ? <CenterSpinner /> : <Content />}</>;
};

function ErrorMessage({ message, setShowError }) {
  return (
    <Alert
      className="alertInPopup"
      variant="danger"
      onClose={() => setShowError(false)}
      dismissible
    >
      <Alert.Heading>Ups!</Alert.Heading>
      <p>{message}</p>
    </Alert>
  );
}

export default CreateGarden;
