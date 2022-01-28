import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useDispatch } from "react-redux";
import { logoutUser } from "../store/actions/auth";
import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { Formik } from "formik";
import { useSelector } from "react-redux";
import Navigation from "../components/Navigation";
import { CenterSpinner } from "../components/Loader";
import styles from "../styles/creategarden.module.scss";
import {
  createGarden,
  joinGarden,
  deleteGarden,
} from "../helpers/manageGarden";
import { userGetUrl } from "../helpers/urls";
let Yup = require("yup");
import { loginUser } from "../store/actions/auth.js";
import Alert from "react-bootstrap/Alert";

const Map = dynamic(() => import("../components/MapPicker.jsx"), {
  ssr: false,
});

// Schema for yup
const validationSchemaEN = Yup.object().shape({
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

const validationSchemaDE = Yup.object().shape({
  name: Yup.string().required("Bitte Name des Gartens eingeben"),
  description: Yup.string().required(
    "Bitte eine Beschreibung des Gartens eingeben"
  ),
  phone: Yup.number().typeError("Bitte eine Kontakt-Telefonnummer eingeben"),
  address: Yup.string().typeError("Bitte Adresse des Gartens eingeben"),
  email: Yup.string()
    .email("*bitte eine valide Email-Adresse eingeben")
    .required("*bitte eine valide Email-Adresse eingeben"),
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
        setLoading(false);
      }
    })();
  }, []);

  const Content = () => {
    //controls popup with map to set location
    const [popupVisible, setPopupVisible] = useState(false);
    const [position, setPosition] = useState({ lat: 0, lng: 0 });

    const lang = useSelector((state) => state.lang);

    return (
      <>
        <Head>
          {lang === "eng" ? (
            <title>New Garden</title>
          ) : (
            <title>Neuer Garten</title>
          )}
        </Head>
        <div className='bodyBox'>
          <Navigation />
          <div
            className={styles.createGardenForm}
            style={{
              width: "80%",
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: "80px",
            }}>
            <h2>{lang === "eng" ? "New Garden" : "Neuer Garten"}</h2>
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
              validationSchema={
                lang === "eng" ? validationSchemaEN : validationSchemaDE
              }
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                setLoading(true);
                setShowError(false);
                setSubmitting(true);

                if (position.lat !== 0 && position.long !== 0) {
                  values["geom_point"] =
                    "POINT(" + position.lng + " " + position.lat + ")";
                  values["latitude"] = position.lat;
                  values["longitude"] = position.lng;
                }

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
                          lang === "eng"
                            ? "Something went wrong creating the garden"
                            : "Etwas ist schief gegangen beim Erstellen des Gartens."
                        );
                      } else {
                        throw new Error(
                          lang === "eng"
                            ? "Something went wrong registering the user in the garden.\
                                  The Garden was tried to be deleted, but failed.\
                                  The Garden has the ID " +
                              gardenId
                            : "Etwas ist schief gegangen beim Registrieren des Nutzers im Garten.\
                            Es wurde versucht den Garten zu löschen, aber auch das ging schief.\
                            Der Garten hat die ID " +
                              gardenId
                        );
                      }
                    }
                  } else {
                    throw new Error(
                      lang === "eng"
                        ? "Something went wrong creating the garden"
                        : "Etwas ist schief gegangen beim Erstellen des Gartens"
                    );
                  }
                } catch (err) {
                  setLoading(false);
                  setErorrMessage(err.message);
                  setShowError(true);
                }
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
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type='text'
                      name='name'
                      placeholder='Name'
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.name}
                      className={
                        touched.name && errors.name ? "errorForm" : null
                      }
                    />
                    {touched.name && errors.name ? (
                      <div className='errorForm-message'>{errors.name}</div>
                    ) : null}
                  </Form.Group>
                  <Form.Group className='form-group' controlId='formEmail'>
                    <Form.Label>Email</Form.Label>
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

                  <Form.Group className='form-group' controlId='formEmail'>
                    <Form.Label>
                      {lang === "eng" ? "Phone" : "Telefon"}
                    </Form.Label>
                    <Form.Control
                      type='text'
                      name='phone'
                      placeholder={lang === "eng" ? "Phone" : "Telefon"}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.phone}
                      className={
                        touched.phone && errors.phone ? "errorForm" : null
                      }
                    />
                    {touched.phone && errors.phone ? (
                      <div className='errorForm-message'>{errors.phone}</div>
                    ) : null}
                  </Form.Group>

                  <Form.Group className='form-group' controlId='formEmail'>
                    <Form.Label>
                      {lang === "eng" ? "Address" : "Adresse"}
                    </Form.Label>
                    <Form.Control
                      type='text'
                      name='address'
                      placeholder={lang === "eng" ? "Address" : "Adresse"}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.address}
                      className={
                        touched.address && errors.address ? "errorForm" : null
                      }
                    />
                    {touched.address && errors.address ? (
                      <div className='errorForm-message'>{errors.address}</div>
                    ) : null}
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>
                      {lang == "eng" ? "Location" : "Ort des Gartens"}
                    </Form.Label>
                    <Row>
                      <Col xs={8}>
                        <Form.Control
                          type='text'
                          readOnly={true}
                          value={
                            lang === "eng"
                              ? position.lat !== 0 && position.lng !== 0
                                ? "Latitude: " + position.lat
                                : "Locaiton optional"
                              : position.lat !== 0 && position.lng !== 0
                              ? "Breite: " + position.lat
                              : "Ort optional"
                          }
                        />
                        <Form.Control
                          type='text'
                          readOnly={true}
                          value={
                            lang === "eng"
                              ? position.lat !== 0 && position.lng !== 0
                                ? "Longitude: " + position.lng
                                : "Locaiton optional"
                              : position.lat !== 0 && position.lng !== 0
                              ? "Länge: " + position.lng
                              : "Ort optional"
                          }
                        />
                      </Col>
                      <Col>
                        <Button
                          className={styles.mapButton}
                          variant='secondary'
                          onClick={() => setPopupVisible(true)}>
                          <img src='/imgs/icons8-map-96.png' alt='Map' />
                        </Button>
                      </Col>
                    </Row>
                  </Form.Group>
                  <Form.Group className='form-group' controlId='formEmail'>
                    <Form.Label>
                      {lang === "eng"
                        ? "Purpose of the garden"
                        : "Zweck des Gartens"}
                    </Form.Label>
                    <Form.Select
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.primary_purpose}
                      className={
                        touched.primary_purpose && errors.primary_purpose
                          ? "errorForm"
                          : null
                      }>
                      {lang === "eng" ? (
                        <>
                          <option value='RESOURCES'>Ressource Sharing</option>
                          <option value='GARDEN'>Community Garden</option>
                        </>
                      ) : (
                        <>
                          <option value='RESOURCES'>
                            Teilen von Resourcen
                          </option>
                          <option value='GARDEN'>Gemeinschaftsgarten</option>
                        </>
                      )}
                    </Form.Select>
                    {touched.primary_purpose && errors.primary_purpose ? (
                      <div className='errorForm-message'>
                        {errors.primary_purpose}
                      </div>
                    ) : null}
                  </Form.Group>

                  <Form.Group className='form-group' controlId='formEmail'>
                    <Form.Label>
                      {lang === "eng" ? "Description" : "Beschreibung"}
                    </Form.Label>
                    <Form.Control
                      as='textarea'
                      rows={3}
                      name='description'
                      placeholder={
                        lang === "eng" ? "Description" : "Beschreibung"
                      }
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
                      <div className='errorForm-message'>
                        {errors.description}
                      </div>
                    ) : null}
                  </Form.Group>

                  <Button
                    className='form-group'
                    variant='primary'
                    type='submit'
                    disabled={isSubmitting}>
                    {lang === "eng" ? "Create Garden" : "Garten erstellen"}
                  </Button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
        {popupVisible && (
          <MapPopup
            position={position}
            setPosition={setPosition}
            setPopupVisible={setPopupVisible}
          />
        )}
      </>
    );
  };
  return <>{loading ? <CenterSpinner /> : <Content />}</>;
};

function MapPopup({ position, setPosition, setPopupVisible }) {
  const lang = useSelector((state) => state.lang);

  // Location is first only stored in this variable (when clicking the map)
  // Only when user hits Submit button, the location is transferred to the "position" variable
  const [localPosition, setLocalPosition] = useState(position);
  return (
    <div className={styles.popup}>
      <div className={styles.popup_inner}>
        <Map
          localPosition={localPosition}
          setLocalPosition={setLocalPosition}
        />
        <Row className={styles.createGardenPopupRow}>
          <Col>
            <OverlayTrigger
              placement='top'
              overlay={
                <Tooltip id={"tooltip-top"}>
                  {lang === "eng"
                    ? "Click to submit this location to the form"
                    : "Hier klicken, um diesen Ort in das Formular zu übernehmen"}
                </Tooltip>
              }>
              <Button
                variant='primary'
                className={styles.submit}
                onClick={() => {
                  setPosition(localPosition);
                  setPopupVisible(false);
                }}>
                {lang === "eng" ? "Submit location" : "Eintragen"}
              </Button>
            </OverlayTrigger>
          </Col>
          <Col>
            <div className={styles.delete}>
              <OverlayTrigger
                placement='top'
                overlay={
                  <Tooltip id={"tooltip-top"}>
                    {lang === "eng"
                      ? "Click to delete this location from the form"
                      : "Hier klicken, um den Ort aus dem Formular zu löschen"}
                  </Tooltip>
                }>
                <Button
                  variant='danger'
                  onClick={() => {
                    setPosition({ lat: 0, lng: 0 });
                    setPopupVisible(false);
                  }}>
                  {lang === "eng" ? "Delete" : "Löschen"}
                </Button>
              </OverlayTrigger>
            </div>
          </Col>
          <Col>
            <OverlayTrigger
              placement='top'
              overlay={
                <Tooltip id={"tooltip-top"}>
                  {lang === "eng"
                    ? "Click to close form"
                    : "Hier klicken, um abzubrechen"}
                </Tooltip>
              }>
              <Button
                variant='secondary'
                className={styles.cancel}
                onClick={() => setPopupVisible(false)}>
                {lang === "eng" ? "Cancel" : "Abbrechen"}
              </Button>
            </OverlayTrigger>
          </Col>
        </Row>
      </div>
    </div>
  );
}

function ErrorMessage({ message, setShowError }) {
  return (
    <Alert
      className='alertInPopup'
      variant='danger'
      onClose={() => setShowError(false)}
      dismissible>
      <Alert.Heading>Ups!</Alert.Heading>
      <p>{message}</p>
    </Alert>
  );
}

export default CreateGarden;
