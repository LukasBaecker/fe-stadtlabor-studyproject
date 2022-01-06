import Head from "next/head";
import { useRouter } from "next/router";

import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import Header from "../../../components/Header";
import { CenterSpinner } from "../../../components/Loader";
import Form from "react-bootstrap/Form";

import styles from "../../../styles/garden.module.scss";
import { useState, useEffect, createContext, useContext } from "react";

// Context that is used to wrap the page in
const GardenContext = createContext();

function garden() {
  const router = useRouter();
  const { id } = router.query;

  // controls, what the page is showing, depending on which button is pressed
  // 1: Info (default, shows when site is loaded)
  // 2: Events
  // 3: Members
  // 4: Sharables
  const [pageState, setPageState] = useState(1);

  // determins, whether the loading circle is shown or the page
  const [loading, setLoading] = useState(false);
  const [gardenName, setGardenName] = useState("Münstergarden");

  return (
    <GardenContext.Provider
      value={{ gardenName, setLoading, pageState, setPageState }}
    >
      <Head>
        <title>The garden {id}</title>
      </Head>

      {loading ? <CenterSpinner /> : <Content gardenName={gardenName} />}
    </GardenContext.Provider>
  );
}

function Content({ gardenName }) {
  const { pageState, setPageState } = useContext(GardenContext);

  return (
    <>
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
              <img
                src="/imgs/icons8-info-100.png"
                alt="Info"
                className={styles.menuButtonIcon}
              />
            </Button>
            <Button variant="primary" onClick={() => setPageState(2)}>
              <img
                src="/imgs/icons8-kalender-bearbeiten-100.png"
                alt="Events"
                className={styles.menuButtonIcon}
              />
            </Button>
            <Button variant="primary" onClick={() => setPageState(3)}>
              <img
                src="/imgs/icons8-benutzergruppen-100.png"
                alt="Members"
                className={styles.menuButtonIcon}
              />
            </Button>
            <Button variant="primary" onClick={() => setPageState(4)}>
              <img
                src="/imgs/icons8-bohrmaschine-100.png"
                alt="Tools"
                className={styles.menuButtonIcon}
              />
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

/* 
Info Page:
Rendered, when the user clicks the Info Button in ButtonGroup.
Shows general informatino about the garden community, e.g. description.
*/
function Info() {
  return (
    <div className={styles.pagePartContent}>
      <h1>Info</h1>
      This is the garden description
    </div>
  );
}

/* 
Event Page:
Rendered, when the user clicks the Event Button in ButtonGroup.
Shows the past and futere events that take place in the garden
*/
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
      <div className={styles.listing}>
        {upcomingEvents.map((evt) => (
          <Event key={evt.id} event={evt} />
        ))}
      </div>

      <AddButton ExecuteFunction={AddEvent} />

      <h2 style={{ marginTop: "25px" }}>Past Events</h2>
      <div className={styles.listing}>
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
    <div className={styles.listItem}>
      <div
        className={
          // assign multiple classes to div
          [styles.listItemGraphic, styles.listItemGraphicCalendar].join(" ")
        }
      >
        <div className={styles.eventDateMonth}>
          {monthNames[eventDate.getMonth()]}
        </div>
        <div className={styles.eventDateDay}>{eventDate.getDate()}</div>
      </div>
      <div className={styles.listItemContent}>
        <div className={styles.listItemDetail}>
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

// Popup to add a new event
function AddEvent({ setPopupVisible }) {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState(""); // used for both date and time
  const [eventLocation, setEventLocation] = useState("");
  const [eventDescription, setEventDescription] = useState("");

  return (
    <div className={styles.popup}>
      <div className={styles.popup_inner}>
        <h3>New Event</h3>
        <Form>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Event name"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="datetime-local"
              placeholder="Date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Location"
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              as="textarea"
              placeholder="Description"
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              rows={3}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
        <button
          className={styles.popupCloseButton}
          onClick={() => setPopupVisible(false)}
        >
          X
        </button>
      </div>
    </div>
  );
}

/* 
Members Page:
Rendered, when the user clicks the Members Button in ButtonGroup.
Shows all members of the community and their role (admin or normal member).
Admins can remove members or promote members to admins.
*/
function Members() {
  const [members, setMembers] = useState([
    { id: 1, name: "John Doe", role: "admin" },
    { id: 3, name: "Garten Zwerg", role: "member" },
    { id: 4, name: "Max Mustermann", role: "member" },
    { id: 5, name: "Julia Julietta", role: "member" },
    { id: 6, name: "Harry Potter", role: "member" },
    { id: 7, name: "James Bond", role: "member" },
    { id: 8, name: "Santa Claus", role: "admin" },
  ]);

  //sort all members into admins and normal members
  // so we can list them systematically
  const admins = members.filter((member) => member.role === "admin");
  const normalMembers = members.filter((member) => member.role === "member");

  return (
    <div className={styles.pagePartContent}>
      <h2>Members</h2>
      <div className={styles.listing}>
        {/* first show all admin members */}
        {admins.map((member) => (
          <Member key={member.id} member={member} />
        ))}

        {/* now show all normal members */}
        {normalMembers.map((member) => (
          <Member key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}

function Member({ member }) {
  return (
    <div className={styles.listItem}>
      <img
        src="https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/default-avatar.png"
        alt="user profile picture"
        className={
          // assign multiple classes to element
          [styles.listItemGraphic, styles.listItemGraphicImage].join(" ")
        }
      />
      <div className={styles.listItemContent}>
        <div className={styles.listItemDetail}>
          {member.role}
          <h3>{member.name}</h3>
        </div>
      </div>
    </div>
  );
}

/* 
Shareables Page:
Rendered, when the user clicks the Shareable Button in ButtonGroup.
Shows all items that the garden community offers to share with other people.
Items can be added, admin can remove items.
*/
function Shareables() {
  const [items, setItems] = useState([
    { id: 1, name: "Drilling machine", type: "Tool" },
    { id: 2, name: "Horse Dung", type: "Fertelizer" },
    { id: 3, name: "Grass Seeds", type: "Seeds" },
    { id: 4, name: "Lawnmower", type: "Tool" },
  ]);

  return (
    <div className={styles.pagePartContent}>
      <h2>Shareables</h2>
      <div className={styles.listing}>
        {items.map((item) => (
          <ShareableItem key={item.id} item={item} />
        ))}
      </div>
      <AddButton ExecuteFunction={AddShareable} />
    </div>
  );
}

function ShareableItem({ item }) {
  return (
    <div className={styles.listItem}>
      <img
        src="https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/default-avatar.png"
        alt="user profile picture"
        className={
          // assign multiple classes to element
          [styles.listItemGraphic, styles.listItemGraphicImage].join(" ")
        }
      />
      <div className={styles.listItemContent}>
        <div className={styles.listItemDetail}>
          {item.type}
          <h3>{item.name}</h3>
        </div>
      </div>
    </div>
  );
}

// Popup to add a new shareable
function AddShareable({ setPopupVisible }) {
  const [shareableName, setShareableName] = useState("");
  const [shareableCategory, setShareableCategory] = useState(0);

  return (
    <div className={styles.popup}>
      <div className={styles.popup_inner}>
        <h3>New Shareable</h3>
        <Form>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Shareable name"
              value={shareableName}
              onChange={(e) => setShareableName(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Category</Form.Label>
            <Form.Select
              value={shareableCategory}
              onChange={(e) => setShareableCategory(e.target.value)}
            >
              <option value="0">Tools</option>
              <option value="1">Seeds</option>
              <option value="2">Fertelizers</option>
              <option value="3">Compost</option>
              <option value="4">Cosntruction Material</option>
              <option value="5">Gardens</option>
              <option value="6">Other</option>
            </Form.Select>
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
        <button
          className={styles.popupCloseButton}
          onClick={() => setPopupVisible(false)}
        >
          X
        </button>
      </div>
    </div>
  );
}

/*
Floating Action Button on the bottom of the screen:
Used to add something (Event or Shareable)
Opens an overlay popup with the form to add something
*/
function AddButton({ ExecuteFunction }) {
  // function to calculate left position in px of element
  const getPosition = () => {
    const pxBody = document.body.clientWidth;
    const pxHtml = window.innerWidth;
    const pos = pxHtml / 2 + pxBody / 2 - 20;
    return pos;
  };

  //state-variable to store left position in px
  const [leftPosition, setLeftPosition] = useState(getPosition());

  // function to execute on window resizing
  // keeps the element where it is supposed to be
  const onResize = () => {
    const pos = getPosition();
    setLeftPosition(pos);
  };

  useEffect(() => {
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const [popupVisible, setPopupVisible] = useState(false);

  return (
    <>
      <Button
        onClick={() => setPopupVisible(true)}
        className={styles.addButtonNew}
        style={{ left: leftPosition }}
      >
        +
      </Button>
      {popupVisible && <ExecuteFunction setPopupVisible={setPopupVisible} />}
    </>
  );
}
export default garden;
