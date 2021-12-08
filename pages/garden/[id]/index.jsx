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
  const [events, setEvnts] = useState([
    { id: 1, date: "2021-07-12T18:00:00", name: "Barbeque" },
    { id: 2, date: "2021-08-14T11:00:00", name: "Weeding" },
    { id: 3, date: "2021-08-18T09:00:00", name: "Plant potatoes" },
    { id: 4, date: "2021-09-02T19:05:00", name: "Summer party" },
    { id: 5, date: "2021-12-20T18:30:00", name: "Christmas party" },
    { id: 6, date: "2022-01-18T09:23:00", name: "Snowball fight" },
  ]);

  // sort all events into upcoming and past
  const upcomingEvents = events.filter((evt) => {
    const d = new Date(evt.date);
    return d >= Date.now();
  });
  const pastEvents = events.filter((evt) => {
    const d = new Date(evt.date);
    return d < Date.now();
  });

  return (
    <div className={styles.pagePartContent}>
      <h2>Upcoming Events</h2>
      <div className={styles.eventList}>
        {upcomingEvents.map((evt) => (
          <Event key={evt.id} event={evt} />
        ))}
      </div>

      <br />

      <h2>Past Events</h2>
      <div className={styles.eventList}>
        {pastEvents.map((evt) => (
          <Event key={evt.id} event={evt} />
        ))}
      </div>
    </div>
  );
}

function Event({ event }) {
  const eventName = event.name;
  const eventDate = new Date(event.date);

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mai",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Okt",
    "Nov",
    "Dec",
  ];

  // converts a number from a time (e.g. hour) to a string
  // adds a zero to the beginning, if number of digits is 1
  // improves time readibility
  function timeNumber2String(n) {
    const s = String(n);
    return s.length == 1 ? "0" + s : s;
  }

  return (
    <div className={styles.event}>
      <div className={styles.eventDate}>
        <div className={styles.eventDateMonth}>
          {monthNames[eventDate.getMonth()]}
        </div>
        <div className={styles.eventDateDay}>{eventDate.getDate()}</div>
      </div>
      <div className={styles.eventDetailWrapper}>
        <div className={styles.eventDetail}>
          {eventDate.getFullYear() +
            ", " +
            timeNumber2String(eventDate.getHours()) +
            ":" +
            timeNumber2String(eventDate.getMinutes())}
          <h3>{eventName}</h3>
        </div>
      </div>
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
