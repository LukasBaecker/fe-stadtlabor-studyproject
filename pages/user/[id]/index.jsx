import Head from "next/head";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Header from "../../../components/Header";
import { useRouter } from "next/router";

import styles from "../../../styles/User.module.scss";
import { useState } from "react";

function user() {
  const [username, setUsername] = useState("Username");

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
        name="Olaf"
        imgUrl="https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/default-avatar.png"
      />

      {/* Page Content */}
      <div className={styles.Content}>
        <Row xs="1" sm="2" className={styles.Row}>
          <Col className={styles.Col}>
            <Container className={[styles.Item, styles.Garden].join(" ")}>
              Garden
            </Container>
          </Col>
          <Col className={styles.Col}>
            <Container className={[styles.Item, styles.Map].join(" ")}>
              Map
            </Container>
          </Col>
          <Col className={styles.Col}>
            <Container className={[styles.Item, styles.Variety].join(" ")}>
              Variety
            </Container>
          </Col>
          <Col className={styles.Col}>
            <Container className={[styles.Item, styles.Next].join(" ")}>
              Next
            </Container>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default user;
