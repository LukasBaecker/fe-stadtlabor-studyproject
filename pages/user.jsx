import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Head from "next/head";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Header from "../components/Header";
import styles from "../styles/User.module.scss";
import { useSelector } from "react-redux";
import Spinner from "../components/Spinner";
import NotAuthenticated from "../components/NotAuthenticated.jsx";
import { logoutUser } from "../store/actions/auth";
function defaultButtonClick(e) {
  alert("Button pressed:\n" + e.target.textContent);
}

function user() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [gardens, setGardens] = useState([
    { id: 1, name: "Garden 1" },
    { id: 2, name: "Garden 2" },
    { id: 3, name: "Garden 3" },
  ]);
  useEffect(() => {
    (async () => {
      try {
        const request = await fetch(
          "http://giv-project15.uni-muenster.de:9000/api/v1/users/user",
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        const content = await request.json();
        if (content.detail === "Unauthenticated!") {
          dispatch(logoutUser());
          router.push("/login");
        } else {
          setUsername(content.first_name);
          setLoading(false);
        }
      } catch (e) {
        console.log("error: ", e);
      }
    })();
  });

  const content = () => {
    return (
      <div className='bodyBox'>
        {/* Set Header */}
        <Header
          caption='Welcome back'
          name={username}
          imgUrl='https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/default-avatar.png'
        />
        {/* Page Content */}
        <div className={styles.Content}>
          <Row xs='1' sm='2' className={styles.Row}>
            <Col xs='12' sm='12' className={styles.ColGardens}>
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
      </div>
    );
  };
  return (
    <>
      {/* update page title */}
      <Head>
        <title>Userpage</title>
      </Head>
      {/* wait for fetching data from the server*/}
      {loading ? <Spinner /> : content()}
    </>
  );
}

function Gardens({ gardens }) {
  // if the user is not part of a garden (yet), then the width of the two buttons is wider
  // to allign with the rest of the page
  // otherwise, it is only 300px to allign with the other garden entries.
  const lastWidth = gardens.length < 1 ? "100%" : "300px";

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
      onClick={(e) => defaultButtonClick(e)}>
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
        onClick={(e) => defaultButtonClick(e)}>
        Create new Garden
      </button>
      <button
        className={styles.GardenControllerPart}
        onClick={(e) => defaultButtonClick(e)}>
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
      onClick={(e) => defaultButtonClick(e)}>
      Mapview
    </button>
  );
}

//Variety Item
function Variety() {
  return (
    <button
      className={[styles.Item, styles.Variety].join(" ")}
      onClick={(e) => defaultButtonClick(e)}>
      Variety
    </button>
  );
}

export default user;
