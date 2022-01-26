import Head from "next/head";
import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useSelector } from "react-redux";
import CenterSpinner from "../components/Loader.jsx";
import Navigation from "../components/Navigation.jsx";
import { cropsGetUrl, backendBaseUrl } from "../helpers/urls";
import Card from "react-bootstrap/Card";
import { useMediaQuery } from "react-responsive";
function cropvariaty() {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const [offsetY, setOffsetY] = useState(0);
  const lang = useSelector((state) => state.lang);
  const [loading, setLoading] = useState(true);
  const [crops, setCrops] = useState([]);
  // Parallax Scroll Effect on Page Top
  const handleScroll = () => setOffsetY(window.scrollY);
  const calcJumboHeight = (offset) => {
    return 250 - offset;
  };
  useEffect(() => {
    (async () => {
      try {
        const req = await fetch(cropsGetUrl, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const cont = await req.json();
        setCrops(cont);
      } catch (e) {
        console.log("error: ", e);
      } finally {
        setLoading(false);
      }
    })();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <>
      <Head>
        <title>{lang === "eng" ? "Crop Variaty" : "Pflanzenvielfalt"}</title>
      </Head>
      {loading && <CenterSpinner />}
      <>
        <Navigation />
        <Jumbotron offsetY={offsetY} front={true} />
        <Jumbotron offsetY={offsetY} front={false} />
        <CropList crops={crops} />
      </>
    </>
  );
}
const Jumbotron = (props) => {
  const lang = useSelector((state) => state.lang);
  return (
    <div
      className={
        props.front
          ? props.offsetY < 10
            ? "jumbotron cropvariaty start"
            : "jumbotron cropvariaty end"
          : props.offsetY < 10
          ? "jumbotron start cropvariaty background"
          : "jumbotron end cropvariaty background"
      }>
      <div className='jumbotronContent'>
        {" "}
        <h1>{lang === "eng" ? "Crop Variaty" : "Pflanzenvielfalt"}</h1>{" "}
        <p className={props.offsetY < 10 ? "visible" : "hidden"}>
          {lang === "eng"
            ? "Explore all the whole crop variaty and find out how to deal with specific crops. Find out if there are gardens in your area that have got your favourite crops."
            : "Erforsche die Vielfalt der Pflanzenwelt und erhalte alle wichtigen Informationen die du benötigst. Finde heraus ob ein Garten in deiner Nähe deine Lieblingspflanze beherberg."}
        </p>
      </div>
    </div>
  );
};

const SingleCrop = (props) => {
  return (
    <Row key={"rowOf" + props.crop.crop_id}>
      <Col xs={12} md={12}>
        <div className='img-div'>
          {
            <img
              className='post-in-list-img'
              src={backendBaseUrl + props.crop.image}
              alt={"picture of the crop you are currently at."}
            />
          }
        </div>
        <div className='title-div'>
          <h3>{props.crop.name}</h3>
          <p>{props.crop.description}</p>
          <p>{props.crop.characteristics}</p>
        </div>
      </Col>
    </Row>
  );
};

const CropList = (props) => {
  const isDesktop = useMediaQuery({ query: "(min-width: 768px)" });
  return (
    <Container fluid className={isDesktop ? "postlist desktop" : "postlist "}>
      {props.crops.map((p) => (
        <SingleCrop crop={p} />
      ))}
    </Container>
  );
};

export default cropvariaty;
