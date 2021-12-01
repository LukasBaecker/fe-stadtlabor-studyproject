import React, { Fragment, useEffect, useState } from "react";

import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import BootstrapButton from "react-bootstrap/Button";

import styles from "../styles/Home.module.scss";

export default function Home() {
  const [offsetY, setOffsetY] = useState(0);

  // Parallax Scroll Effect on Page Top
  const handleScroll = () => setOffsetY(window.scrollY);
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Boolean State indicating whether the Login Window is currently Shown
  const [loginShown, setLoginShown] = useState(false);

  return (
    <React.Fragment>
      <div className={styles.title}>
        <LoginButton offsetY={offsetY} toggleLoginPopup={setLoginShown} />
        {/* Page Title */}
        <h1 style={{ transform: "translate(-50%, " + offsetY * 0.5 + "px)" }}>
          GardenUp!
        </h1>

        {/* Image of greenhouse in background */}
        <Image
          src="/imgs/greenhouse.png"
          style={{ transform: "translateY(" + offsetY * 0.5 + "px)" }}
        />

        <SignupButton />
        <WhyJoin />
      </div>

      {/* Login-Popup: Only visible if loginShown is True */}
      <LoginPopup isVisible={loginShown} toggleLoginPopup={setLoginShown} />

      <Container className={styles.siteElement}>
        <Image
          src="/imgs/dmitry-dreyer-gHho4FE4Ga0-unsplash.jpg"
          className={styles.decoImage}
        />
      </Container>

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

function LoginButton({ offsetY, toggleLoginPopup }) {
  function onLoginButtonClick() {
    toggleLoginPopup(true);
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
    <Container className={styles.WhyJoinElement}>
      <div className={styles.whyJoin}>
        <h2>Why Join?</h2>
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
        eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
        voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
        clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
        amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
        nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
        sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
        rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem
        ipsum dolor sit amet.
      </div>
    </Container>
  );
}

// Popup that appears when a user clicks the Login Button
function LoginPopup({ isVisible, toggleLoginPopup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onClose = () => toggleLoginPopup(false);
  if (isVisible) {
    return (
      <div className={styles.popup}>
        <div className={styles.popup_inner}>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <BootstrapButton variant="primary" type="submit">
              Submit
            </BootstrapButton>
          </Form>
          <button className={styles.popupCloseButton} onClick={() => onClose()}>
            X
          </button>
        </div>
      </div>
    );
  } else {
    return <React.Fragment />;
  }
}

//Component that lists the advantages with Images and texts
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
    <Container className={styles.siteElement}>
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
    </Container>
  );
}

// Component that shows one advantage: one image plus text
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

// Page Footer with About and Privacy Policy Links
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
