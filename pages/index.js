import React, { Fragment } from "react";
import Image from "react-bootstrap/Image";
import styles from "../styles/Home.module.scss";

export default function Home() {
  return (
    <React.Fragment>
      <div className={styles.title}>
        <Image src="/imgs/greenhouse.png" fluid />
        <h1>GardenUp!</h1>
      </div>
      <SignupButton />
      <WhyJoin />
      <Image
        src="/imgs/dmitry-dreyer-gHho4FE4Ga0-unsplash 1.png"
        className={styles.decoImage}
        fluid
      />
      <Advantages />
      <SignupButton />
      <Image
        src="/imgs/anna-earl-Odhlx3-X0pI-unsplash 1.png"
        className={styles.decoImage}
        fluid
      />
      <Footer />
    </React.Fragment>
  );
}

function SignupButton() {
  return (
    <div className={styles.signup}>
      <button>Sign up!</button>
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
    <div>
      <h2>Advantages of GardenUp</h2>
      {items.map((item) => (
        <AdvantagesItem key={item.id} url={item.url} text={item.text} />
      ))}
    </div>
  );
}

function AdvantagesItem({ url, text }) {
  return (
    <div>
      <Image src={url} />
      <div>{text}</div>
    </div>
  );
}

function Footer() {
  return (
    <div>
      <div>About Privacy Policy</div>
    </div>
  );
}
