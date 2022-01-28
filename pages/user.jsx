import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import router, { useRouter } from "next/router";
import Navigation from "../components/Navigation";
import Head from "next/head";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import styles from "../styles/User.module.scss";
import { useSelector } from "react-redux";
import { CenterSpinner } from "../components/Loader";
import NotAuthenticated from "../components/NotAuthenticated.jsx";
import { logoutUser } from "../store/actions/auth";
import { getGardenUrl, userGetUrl } from "../helpers/urls";
import Dropdown from "react-bootstrap/Dropdown";

function user() {
  const lang = useSelector((state) => state.lang);
  const dispatch = useDispatch();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [gardens, setGardens] = useState([]);
  const [offsetY, setOffsetY] = useState(0);
  // Parallax Scroll Effect on Page Top
  const handleScroll = () => setOffsetY(window.scrollY);
  const calcJumboHeight = (offset) => {
    return 250 - offset;
  };
  async function getGardenName(gardenId) {
    try {
      const request = await fetch(getGardenUrl(gardenId), {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const gardenInfo = await request.json();
      return new Promise((resolve, reject) => {
        if (request.status == 200) {
          resolve({
            id: gardenId,
            name: gardenInfo.properties.name,
          });
        } else {
          reject({ id: gardenId, name: "unknown" });
        }
      });
    } catch (e) {
      console.log("error", e);
    }
  }

  async function getGardenNames(gardenIdList) {
    let l = [];
    for (let i = 0; i < gardenIdList.length; i++) {
      let r = await getGardenName(gardenIdList[i]);
      l.push(r);
    }
    return new Promise((resolve, reject) => {
      resolve(l);
    });
  }

  useEffect(() => {
    (async () => {
      try {
        const request = await fetch(userGetUrl, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const content = await request.json();
        if (content.detail === "Unauthenticated!") {
          dispatch(logoutUser());
          router.push("/login");
        } else {
          setUsername(content.first_name);

          // Get garden info for each garden user is a member of
          const names = await getGardenNames(content.garden);
          setGardens(names);
          setLoading(false);
        }
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
      } catch (e) {
        console.log("error: ", e);
      }
    })();
  }, []);

  const content = () => {
    return (
      <>
        <Navigation />
        {/* Set Header */}
        <Jumbotron offsetY={offsetY} front={true} username={username} />
        <Jumbotron offsetY={offsetY} front={false} username={username} />
        {/* Page Content */}

        <Container className={styles.userContainer}>
          <Row className={styles.userRow}>
            <Col>
              {" "}
              <div
                className={styles.parent}
                onClick={() => router.push("/map")}>
                <div className={`${styles.child} ${styles.bgMap}`}>
                  <a
                    className={styles.aButton}
                    onClick={() => router.push("/map")}>
                    <span>Map View </span>
                  </a>
                </div>
              </div>
            </Col>
            <Col md={12}>
              {" "}
              <div
                className={styles.parent}
                onClick={() => router.push("/cropvariety")}>
                <div className={`${styles.child} ${styles.bgCrops}`}>
                  <a
                    className={styles.aButton}
                    onClick={() => router.push("/cropvariety")}>
                    <span>Crop Variaty </span>
                  </a>
                </div>
              </div>
            </Col>
          </Row>
          <Dropdown.Divider className={styles.divider} />
          <Row className={styles.userRow}>
            <Col>
              <h2>
                {lang === "eng" ? "YOUR MEMBERSHIPS" : "DEINE MITGLIEDSCHAFTEN"}
              </h2>
            </Col>
          </Row>
          <Row className={styles.userRow}>
            {gardens.length != 0 ? (
              gardens.map((garden) => (
                <Col key={garden.id} className={styles.gardenCol}>
                  <button
                    className={[styles.Item, styles.Garden].join(" ")}
                    onClick={() => router.push(`/garden/${garden.id}/`)}
                    style={{ fontSize: "1.5rem" }}>
                    {garden.name}
                  </button>
                </Col>
              ))
            ) : (
              <Col key='placeholderDots' className={styles.gardenCol}>
                <Image
                  className={styles.noGardenImage}
                  src={"/imgs/icons8-hands.svg"}
                />
                <p className={styles.noGardenText}>
                  {lang === "eng"
                    ? "Join a garden or create one to see it appear here. Use the green Plus in the lower right corner!"
                    : "Trete einem Garten bei oder gründe einen neuen, um ihn hier anzuzeigen. Nutze dazu den Button in der rechten unteren Ecke."}
                </p>
              </Col>
            )}
          </Row>
        </Container>
        <AddGardenButton />
      </>
    );
  };

  return (
    <>
      {/* update page title */}
      <Head>
        <title>{lang === "eng" ? "User Profile" : "Benutzerprofil"}</title>
      </Head>
      {/* wait for fetching data from the server*/}
      {loading ? <CenterSpinner /> : content()}
    </>
  );
}

const AddGardenButton = () => {
  const [clicked, setClicked] = useState(false);
  const lang = useSelector((state) => state.lang);
  const router = useRouter();
  return (
    <>
      <div
        className={
          !clicked
            ? styles.btnAddGarden
            : `${styles.btnAddGarden} ${styles.clicked}`
        }
        onClick={() => setClicked(!clicked)}>
        <span className={styles.close}></span>
      </div>
      <div
        className={
          !clicked
            ? styles.menuAddGarden
            : `${styles.menuAddGarden} ${styles.clicked}`
        }>
        <Button variat='primary' onClick={() => router.push("/creategarden")}>
          {lang === "eng" ? "create new Garden" : "Garten erstellen"}
        </Button>
        <Button
          variat='primary'
          onClick={() =>
            router.push({ pathname: "/map", query: { action: "join" } })
          }>
          {lang === "eng" ? "join garden" : "Garten beitrete"}
        </Button>
      </div>
    </>
  );
};

const Jumbotron = (props) => {
  const lang = useSelector((state) => state.lang);
  return (
    <div
      className={
        props.front
          ? props.offsetY < 1
            ? "jumbotron user start"
            : "jumbotron user end"
          : props.offsetY < 1
          ? "jumbotron start user background"
          : "jumbotron end user background"
      }>
      <div className='jumbotronContent'>
        {" "}
        <h1>
          {lang === "eng" ? "Hey," + props.username : "Hi, " + props.username}
        </h1>{" "}
        <p className={props.offsetY < 1 ? "visible" : "hidden"}>
          {lang === "eng"
            ? "On this page you can find all the garderns you are a part of. You can also jump into the map of all gardens registered at GardenUp or see our crop variaty"
            : "Auf dieser Seite findest du alle Gärten denen du dich bereits angeschlossen hast. Außerdem kannst zu direkt zur Karte springen, auf der alle Gärten zu finden sind, die bereits bei GardenUp registriert wurden oder schau dir unsere Pflanzenvielfalt an."}
        </p>
      </div>
    </div>
  );
};

export default user;
