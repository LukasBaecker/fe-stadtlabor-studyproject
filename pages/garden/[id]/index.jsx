import Head from "next/head";
import { useRouter } from "next/router";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Header from "../../../components/Header";

import styles from "../../../styles/User.module.scss";
import { useState } from "react";

function garden() {
  const router = useRouter();
  const { id } = router.query;

  const [gardenName, setGardenName] = useState("Münstergarden");

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
    </>
  );
}

export default garden;
