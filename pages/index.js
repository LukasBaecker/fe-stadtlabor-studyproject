import React, { Fragment, useEffect, useState } from "react";

import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import styles from "../styles/Home.module.scss";

export default function Home() {
  const [offsetY, setOffsetY] = useState(0);

  const handleScroll = () => setOffsetY(window.scrollY);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const parallaxScroll = (scrollFactor) => {
    return;
  };

  return (
    <React.Fragment>
      <div className={styles.title}>
        <Image
          src="/imgs/greenhouse.png"
          style={{ transform: "translateY(" + offsetY * 0.5 + "px)" }}
        />
        <h1 style={{ transform: "translate(-50%, " + offsetY * 0.5 + "px)" }}>
          GardenUp!
        </h1>
        <LoginButton offsetY={offsetY} />
        <SignupButton />
        <WhyJoin />
      </div>
      <Image
        src="/imgs/dmitry-dreyer-gHho4FE4Ga0-unsplash.jpg"
        className={styles.decoImage}
      />
      <Advantages />
      <div className={styles.frontFooter}>
        <SignupButton />
        <Image
          src="/imgs/anna-earl-Odhlx3-X0pI-unsplash.jpg"
          className={styles.decoImage}
          fluid
        />
        <Footer />
      </div>
    </React.Fragment>
  );
}

function LoginButton({ offsetY }) {
  function onLoginButtonClick() {
    console.log("Login not implemented yet");
  }

  return (
    <div className={styles.login}>
      <button
        onClick={() => onLoginButtonClick()}
        style={{ transform: "translateY(" + offsetY * 0.5 + "px)" }}
      >
        Log in!
      </button>
    </div>
  );
}

function SignupButton() {
  function onSignupButtonClick() {
    console.log("Implement href to signup page");
  }

  return (
    <div className={styles.signup}>
      <button onClick={() => onSignupButtonClick()}>Sign up!</button>
    </div>
  );
}

function WhyJoin() {
  return (
    <div className={styles.whyJoin}>
      <h2>Why Join?</h2>
      Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
      eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
      voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
      clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
      amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
      nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed
      diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
      Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor
      sit amet.
    </div>
  );
}

function Advantages() {
  const items = [
    {
      id: 1,
      url: "/imgs/icons8-hands-60 1.png",
      text: "Connect with your local urban gardening community",
    },
    {
      id: 2,
      url: "/imgs/icons8-shovel-50 1.png",
      text: "Find useful tools in your local neighborhood and share yours",
    },
    {
      id: 3,
      url: "/imgs/icons8-plant-60.png",
      text: "Grow the urban garden together",
    },
  ];
  return (
    <div className={styles.advantages}>
      <h2>Advantages of GardenUp</h2>
      <Container className={styles.advantagesContainer}>
        <Row xs={1} sm={3}>
          {items.map((item) => (
            <Col key={item.id} className={styles.advantagesCol}>
              <AdvantagesItem url={item.url} text={item.text} />
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

function AdvantagesItem({ url, text }) {
  return (
    <Container>
      <Row xs={2} sm={1}>
        <Col xs={4} sm={12}>
          <Image src={url} />
        </Col>
        <Col className={styles.advantageText} xs={8} sm={12}>
          {text}
        </Col>
      </Row>
    </Container>
  );
}

function Footer() {
  return (
    <div id={styles.Footer}>
      <div className={styles.middleDiv} />
      <div className={styles.bottomDiv}>
        About <br /> Privacy Policy
      </div>
    </div>
  );
}
