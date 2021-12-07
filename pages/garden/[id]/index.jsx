import Head from "next/head";
import { useRouter } from "next/router";

import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Header from "../../../components/Header";

import styles from "../../../styles/garden.module.scss";
import { useState } from "react";

function garden() {
  const router = useRouter();
  const { id } = router.query;

  const [gardenName, setGardenName] = useState("Münstergarden");

  // controls, what the page is showing, depending on which button is pressed
  // 1: Info (default, shows when site is loaded)
  // 2: Events
  // 3: Members
  // 4: Sharables
  const [pageState, setPageState] = useState(1);

  return (
    <>
      <Head>
        <title>The garden {id}</title>
      </Head>

      {/* Set Header */}
      <Header
        caption="Garden"
        name={gardenName}
        imgUrl="/imgs/markus-spiske-bk11wZwb9F4-unsplash-square.jpg"
      />

      {/* Page Content */}
      <div className={styles.Content}>
        <ButtonGroup aria-label="Basic example" className={styles.buttonGroup}>
          <Button variant="primary" onClick={() => setPageState(1)}>
            Info
          </Button>
          <Button variant="primary" onClick={() => setPageState(2)}>
            Events
          </Button>
          <Button variant="primary" onClick={() => setPageState(3)}>
            Members
          </Button>
          <Button variant="primary" onClick={() => setPageState(4)}>
            Sharables
          </Button>
        </ButtonGroup>
      </div>
    </>
  );
}

export default garden;
