import Head from "next/head";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Container, Row, Col } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useSelector } from "react-redux";
import CenterSpinner from "../components/Loader.jsx";
import Navigation from "../components/Navigation.jsx";
import { cropsGetUrl, backendBaseUrl, getAllGardens } from "../helpers/urls";
import { useMediaQuery } from "react-responsive";
import Dropdown from "react-bootstrap/Dropdown";
function cropvariety() {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const [offsetY, setOffsetY] = useState(0);
  const lang = useSelector((state) => state.lang);
  const [loading, setLoading] = useState(true);
  const [crops, setCrops] = useState([]);
  const [gardens, setGardens] = useState([]);
  // Parallax Scroll Effect on Page Top
  const handleScroll = () => setOffsetY(window.scrollY);

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
        const gardenReq = await fetch(getAllGardens, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const gardenCont = await gardenReq.json();
        setGardens(gardenCont.features);
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
        <title>{lang === "eng" ? "Crop Variety" : "Pflanzenvielfalt"}</title>
      </Head>
      {loading && <CenterSpinner />}
      <>
        <Navigation />
        <Jumbotron offsetY={offsetY} front={true} />
        <Jumbotron offsetY={offsetY} front={false} />
        <CropList crops={crops} gardens={gardens} />
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
            ? "jumbotron cropvariety start"
            : "jumbotron cropvariety end"
          : props.offsetY < 10
          ? "jumbotron start cropvariety background"
          : "jumbotron end cropvariety background"
      }>
      <div className='jumbotronContent'>
        {" "}
        <h1>{lang === "eng" ? "Crop Variety" : "Pflanzenvielfalt"}</h1>{" "}
        <p className={props.offsetY < 10 ? "visible" : "hidden"}>
          {lang === "eng"
            ? "Explore all the whole crop variety and find out how to deal with specific crops. Find out if there are gardens in your area that have got your favourite crops."
            : "Erforsche die Vielfalt der Pflanzenwelt und erhalte alle wichtigen Informationen die du benötigst. Finde heraus ob ein Garten in deiner Nähe deine Lieblingspflanze beherbergt. Aktuell sind die Daten auf dieser Seite leider nur auf Englisch verfügbar."}
        </p>
      </div>
    </div>
  );
};

const SingleCrop = (props) => {
  const lang = useSelector((state) => state.lang);
  const router = useRouter();
  return (
    <Row key={"rowOf" + props.crop.crop_id}>
      <Col xs={12} md={12}>
        <div className='img-div'>
          {
            <img
              className='post-in-list-img'
              src={backendBaseUrl + props.crop.image}
              alt={"Picture of " + props.crop.name}
            />
          }
        </div>
        <div className='cropContentDiv'>
          <h3>{props.crop.name}</h3>
          <p>{props.crop.description}</p>
          <p>{props.crop.characteristics}</p>
          <Dropdown.Divider className='divider' />
          <h4>
            {lang === "eng"
              ? "Gardens with " + props.crop.name
              : "Gärten mit  " + props.crop.name}
          </h4>
          {props.crop.gardens.map((g) => {
            return (
              <Button
                onClick={() => {
                  router.push("/garden/" + g);
                }}
                className='cropGardenButton'
                key={g}
                variant='secondary'>
                {props.gardens.length != 0
                  ? props.gardens.find((el) => el.id === g).properties.name
                  : "..."}
              </Button>
            );
          })}
        </div>
      </Col>
    </Row>
  );
};

const CropList = (props) => {
  const isDesktop = useMediaQuery({ query: "(min-width: 768px)" });
  const alphabet = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];
  const group = props.crops.reduce((r, e) => {
    const key = e.name[0];
    if (!r[key]) r[key] = [];
    r[key].push(e);
    return r;
  }, {});
  return (
    <Container fluid className={isDesktop ? "postlist desktop" : "postlist "}>
      <div className='alphabetNav'>
        <div className='alphabetInner'>
          |
          {alphabet.map((el) => {
            if (Object.keys(group).includes(el)) {
              return (
                <span className='alphabetLink' key={el}>
                  <a href={"#" + el}>{el}</a>|
                </span>
              );
            } else {
              return <span key={el}>{el}|</span>;
            }
          })}
        </div>
      </div>
      {Object.entries(group).map(([key, value], i) => {
        return (
          <div key={i}>
            <h2>
              <span id={key}> &nbsp; </span>
              {key}
            </h2>
            {value.map((item, j) => (
              <SingleCrop crop={item} gardens={props.gardens} />
            ))}
          </div>
        );
      })}
    </Container>
  );
};

export default cropvariety;
