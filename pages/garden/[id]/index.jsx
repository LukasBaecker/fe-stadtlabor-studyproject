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
        <div className={styles.buttonGroupWrapper}>
          <ButtonGroup className={styles.buttonGroup}>
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

        {/* Decide what page part shoud be rendered,
        depending on what the pageState is (set in Buttongroup) */}
        {pageState === 1 && <Info />}
        {pageState === 2 && <Events />}
        {pageState === 3 && <Members />}
        {pageState === 4 && <Shareables />}
      </div>
    </>
  );
}

function Info() {
  return (
    <div className={styles.pagePartContent}>
      <h1>Info</h1>
      This is the garden description
    </div>
  );
}

function Events() {
  return (
    <div className={styles.pagePartContent}>
      <h1>Events</h1>
      This is the garden event page
    </div>
  );
}

function Members() {
  return (
    <div className={styles.pagePartContent}>
      <h1>Members</h1>
      This is the membre page
    </div>
  );
}

function Shareables() {
  return (
    <div className={styles.pagePartContent}>
      <h1>Shareables</h1>
      This is the garden Shareables page
    </div>
  );
}

export default garden;
