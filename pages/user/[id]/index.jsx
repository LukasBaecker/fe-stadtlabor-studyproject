import Head from "next/head";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Header from "../../../components/Header";
import { useRouter } from "next/router";

import styles from "../../../styles/User.module.scss";
import { useState } from "react";

function defaultButtonClick(e) {
  alert("Button pressed:\n" + e.target.textContent);
}

function user() {
  const [username, setUsername] = useState("John");

  const [gardens, setGardens] = useState([
    { id: 1, name: "Garden 1" },
    { id: 2, name: "Garden 2" },
    { id: 3, name: "Garden 3" },
  ]);

  const router = useRouter();
  const { id } = router.query;
  return (
    <>
      {/* update page title */}
      <Head>
        <title>Your page, {id}</title>
      </Head>

      {/* Set Header */}
      <Header
        caption="Welcome back"
        name={username}
        imgUrl="https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/default-avatar.png"
      />

      {/* Page Content */}
      <div className={styles.Content}>
        <Row xs="1" sm="2" className={styles.Row}>
          <Col xs="12" sm="12" className={styles.ColGardens}>
            <Gardens gardens={gardens} />
          </Col>
          <Col className={styles.Col}>
            <Map />
          </Col>
          <Col className={styles.Col}>
            <Variety />
          </Col>
        </Row>
      </div>
    </>
  );
}

function Gardens({ gardens }) {
  // if the user is not part of a garden (yet), then the width of the two buttons is wider
  // to allign with the rest of the page
  // otherwise, it is only 300px to allign with the other garden entries.
  const lastWidth = gardens.length < 1 ? "100%" : "300px;";

  const style = {
    gridTemplateColumns: "300px ".repeat(gardens.length) + lastWidth,
  };

  return (
    <div className={styles.Gardens} style={style}>
      {gardens.map((garden) => (
        <Garden key={garden.id} gardenName={garden.name} />
      ))}
      <GardenController />
    </div>
  );
}

//Garden Item
function Garden({ gardenName }) {
  return (
    <button
      className={[styles.Item, styles.Garden].join(" ")}
      onClick={(e) => defaultButtonClick(e)}
    >
      {gardenName}
    </button>
  );
}

function GardenController() {
  return (
    <Container className={[styles.Item, styles.GardenController].join(" ")}>
      <button
        className={styles.GardenControllerPart}
        style={{ borderRight: "1px solid black" }}
        onClick={(e) => defaultButtonClick(e)}
      >
        Create new Garden
      </button>
      <button
        className={styles.GardenControllerPart}
        onClick={(e) => defaultButtonClick(e)}
      >
        Join a Garden
      </button>
    </Container>
  );
}

//Map Item
function Map() {
  return (
    <button
      className={[styles.Item, styles.Map].join(" ")}
      onClick={(e) => defaultButtonClick(e)}
    >
      Mapview
    </button>
  );
}

//Variety Item
function Variety() {
  return (
    <button
      className={[styles.Item, styles.Variety].join(" ")}
      onClick={(e) => defaultButtonClick(e)}
    >
      Variety
    </button>
  );
}

export default user;
