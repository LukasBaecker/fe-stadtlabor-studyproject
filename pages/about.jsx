import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Formik } from "formik";
import { loginUser } from "../store/actions/auth.js";
import { useDispatch, useSelector } from "react-redux";
import Alert from "react-bootstrap/Alert";
import CenterSpinner from "../components/Loader.jsx";
import Navigation from "../components/Navigation.jsx";
import { userLoginPostUrl } from "../helpers/urls";

const About = () => {
  const lang = useSelector((state) => state.lang);

  return (
    <>
      <Head>
        <title>{lang === "eng" ? "About" : "Über"}</title>
      </Head>
      <>
        <Navigation />
        <div className='bodyBox'>
          <div
            style={{
              width: "80%",
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: "80px",
            }}>
            <h1>{lang === "eng" ? "About" : "Über"}</h1>

            {lang != "eng" ? (
              <>
                <h2>Kontakt</h2>
                <p>
                  Institut für Geoinformatik
                  <br />
                  Heisenbergstraße 2<br />
                  48149 Münster
                </p>
                <p>
                  Tel: +49 251 – 83 33 08 3<br />
                  Fax: +49 251 – 83 39 76 3<br />
                  geoinformatik@uni-muenster.de
                </p>

                <h2>Impressum</h2>
                <p>Westfälischen Wilhelms-Universität Münster</p>
                <p>
                  Fachbereich 14 Geowissenschaften
                  <br />
                  Heisenbergstr. 2, 48149 Münster
                  <br />
                  Tel.: +49 251 83-30001
                  <br />
                  E-Mail: gfgeo@uni-muenster.de
                </p>
                <p>
                  Der Fachbereich 14 Geowissenschaften ist eine Einrichtung der
                  Westfälischen Wilhelms-Universität Münster, WWU. Die WWU ist
                  eine Körperschaft des öffentlichen Rechts und zugleich eine
                  Einrichtung des Landes Nordrhein-Westfalen. Sie wird vertreten
                  durch Rektor Prof. Dr. Johannes Wessels.
                </p>
                <h2>Zuständige Aufsichtsbehörde</h2>
                <p>
                  Ministerium für Innovation, Wissenschaft und Forschung des
                  Landes Nordrhein-Westfalen
                  <br />
                  Völklinger Straße 49
                  <br />
                  40221 Düsseldorf
                  <br />
                  <br />
                  Umsatzsteuer-ID-Nummer: DE 126118759
                </p>
                <h2>Redaktionell verantwortlich gemäß § 55 Abs. 2 (RStV):</h2>
                <p>
                  Geschäftsführender Direktor
                  <br />
                  Prof. Dr. Christian Kray
                  <br />
                  Heisenbergstraße 2
                  <br />
                  D-48149 Münster
                  <br />
                  <br />
                  E-Mail: c.kray@uni-muenster.de
                </p>
                <h2>Sekretariat</h2>
                <p>
                  Karsten Höwelhans, Heike Wiefel, Christina Versmold
                  <br />
                  Telefon: +49 (251) 83-33 083
                  <br />
                  E-Mail: geoinformatik@uni-muenster.de
                </p>
                <h2>Haftungshinweis</h2>
                <p>
                  Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine
                  Haftung für die Inhalte externer Links. Für den Inhalt der
                  verlinkten Seiten sind ausschließlich deren Betreiber
                  verantwortlich.
                </p>
              </>
            ) : (
              <>
                <>
                  <h2>Contact</h2>
                  <p>
                    Institut für Geoinformatik
                    <br />
                    Heisenbergstraße 2<br />
                    48149 Münster
                  </p>
                  <p>
                    Tel: +49 251 – 83 33 08 3<br />
                    Fax: +49 251 – 83 39 76 3<br />
                    geoinformatik@uni-muenster.de
                  </p>
                  <>
                    <h2>Legal Notice</h2>
                    <p>University of Muenster</p>
                    <p>
                      Institute for Geoinformatics
                      <br />
                      Heisenbergstr. 2
                      <br />
                      D-48149 Münster
                      <br />
                      <br />
                      Phone: +49 (251) 83-33 083
                    </p>

                    <h2>Responsible for this Website:</h2>
                    <p>
                      Director
                      <br />
                      Prof. Dr. Christian Kray
                      <br />
                      Heisenbergstraße 2
                      <br />
                      D-48149 Münster
                      <br />
                      <br />
                      E-Mail: c.kray@uni-muenster.de
                    </p>
                    <h2>Office</h2>
                    <p>
                      Karsten Höwelhans,
                      <br />
                      Heike Wiefel,
                      <br />
                      Christina Versmold
                      <br />
                      <br />
                      Phone: +49 (251) 83-33 083
                      <br />
                      E-Mail: geoinformatik@uni-muenster.de
                    </p>
                    <h2>Notice of Liability</h2>
                    <p>
                      Although we check the content carefully, we cannot accept
                      responsibility for the content of external links. The
                      linked sites’ carriers are responsible for their sites’
                      content.
                    </p>
                  </>
                </>
              </>
            )}
          </div>
        </div>
      </>
    </>
  );
};

export default About;
