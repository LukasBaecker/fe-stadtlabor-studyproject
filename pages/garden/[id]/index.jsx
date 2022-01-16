import Head from "next/head";
import { useRouter } from "next/router";

import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import Header from "../../../components/Header";
import { CenterSpinner } from "../../../components/Loader";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

import styles from "../../../styles/garden.module.scss";
import { useState, useEffect, createContext, useContext } from "react";

// Context that is used to wrap the page in
const GardenContext = createContext();

/*
Function to fetch all events in database,
then filters them by garden-id to only show the relevant ones
*/
async function fetchEvents(id, setEvents) {
  // Fetch events
  try {
    const request = await fetch(
      `http://giv-project15.uni-muenster.de:9000/api/v1/events/all`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );
    const cont = await request.json();
    const evts = cont.filter((evt) => evt.garden == id);
    setEvents(evts);
  } catch (e) {
    console.log(e);
  }
}

/*
Function to fetch all resources in database,
then filters them by garden-id to only show the relevant ones
*/
async function fetchResources(id, setResources) {
  // Fetch Resources
  try {
    const request = await fetch(
      "http://giv-project15.uni-muenster.de:9000/api/v1/gardens/resources/all",
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );
    const cont = await request.json();
    const resources = cont.filter((resource) => resource.garden == id);
    setResources(resources);
  } catch (e) {
    console.log(e);
  }
}

function garden() {
  const router = useRouter();
  const { id } = router.query;

  // determins, whether the loading circle is shown or the page
  const [loading, setLoading] = useState(true);

  const [gardenName, setGardenName] = useState("");
  const [gardenDetails, setGardenDetails] = useState("");
  const [events, setEvents] = useState([]);
  const [resources, setResources] = useState([]);

  const [showError, setShowError] = useState(false);
  const [errorText, setErrorText] = useState("");

  const [dataFetched, setDataFetched] = useState(false);
  useEffect(() => {
    if (id && !dataFetched) {
      (async () => {
        // Fetch general garden information
        try {
          const request = await fetch(
            `http://giv-project15.uni-muenster.de:9000/api/v1/gardens/all/${id}/`,
            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
            }
          );
          const cont = await request.json();
          if (cont.detail === "Not found.") {
            throw new Error("Garden not found");
          } else {
            setGardenDetails(cont.properties);
          }
        } catch (e) {
          if (e.message === "Garden not found") {
            setErrorText(`Could not find garden with ID ${id}`);
          } else {
            setErrorText(`Something went wrong loading garden with ID ${id}`);
          }
          console.log(e);
          setShowError(true);
        }

        fetchEvents(id, setEvents); // fetch events
        fetchResources(id, setResources); // fetch resources
      })();
      setDataFetched(true);
      setLoading(false);
    }
  });

  // controls, what the page is showing, depending on which button is pressed
  // 1: Info (default, shows when site is loaded)
  // 2: Events
  // 3: Members
  // 4: Sharables
  const [pageState, setPageState] = useState(1);

  return (
    <GardenContext.Provider
      value={{
        gardenDetails,
        gardenId: id,
        events,
        setEvents,
        resources,
        setResources,
        setLoading,
        pageState,
        setPageState,
      }}
    >
      {loading ? (
        <CenterSpinner />
      ) : (
        <div className="bodyBox">
          {showError ? (
            <>
              <ErrorAlert
                setShowError={setShowError}
                heading={"Ups"}
                message={errorText}
              />
              <Button variant="primary" onClick={() => router.push("/user/")}>
                Back
              </Button>
            </>
          ) : (
            <Content />
          )}
        </div>
      )}
    </GardenContext.Provider>
  );
}

/*
Entire page content:
Everything that is shown, when the page is not loading
*/
function Content() {
  const { pageState, setPageState } = useContext(GardenContext);
  const { gardenDetails } = useContext(GardenContext);
  return (
    <>
      <Head>
        <title>{gardenDetails.name}</title>
      </Head>

      {/* Set Header */}
      <Header
        caption="Garden"
        name={gardenDetails.name}
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
  const { gardenDetails } = useContext(GardenContext);

  return (
    <div className={styles.pagePartContent}>
      <h5>{gardenDetails.email}</h5>
      <h5>{gardenDetails.phone}</h5>
      <hr />
      {gardenDetails.description}
    </div>
  );
}

/* 
Event Page:
Rendered, when the user clicks the Event Button in ButtonGroup.
Shows the past and futere events that take place in the garden
*/
function Events() {
  const { events } = useContext(GardenContext);

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
          <Event key={evt.event_id} event={evt} />
        ))}
      </div>

      <AddButton ExecuteFunction={AddEvent} />

      <h2 style={{ marginTop: "25px" }}>Past Events</h2>
      <div className={styles.listing}>
        {pastEvents.map((evt) => (
          <Event key={evt.event_id} event={evt} />
        ))}
      </div>
    </div>
  );
}

function Event({ event }) {
  const eventName = event.title;
  const eventDate = new Date(event.date);

  const [popupVisible, setPopupVisible] = useState(false);

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
    <div className={styles.listItem} onClick={() => setPopupVisible(true)}>
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
      {popupVisible && (
        <EventDetails event={event} setPopupVisible={setPopupVisible} />
      )}
    </div>
  );
}

/*
Popup to display details of each event,
e.g. description, venue, date and time...
*/
function EventDetails({ event, setPopupVisible }) {
  /*
  I know this looks like really strange programming...
  For some  reason I was not able to manage to get x-button
  to change state using setPopupVisible() directly.
  But it does work when executing this function in the else{} clause...
  Hence this strange construct here...
  */
  const [visible, setVisible] = useState(true);
  if (visible) {
    return (
      <div className={styles.popup}>
        <div className={styles.popup_inner}>
          {new Date(event.date).toLocaleString()}
          <h3>{event.title}</h3>
          Location: {event.venue}
          <hr />
          {event.description}
          <button
            className={styles.popupCloseButton}
            onClick={() => setVisible(false)}
          >
            X
          </button>
        </div>
      </div>
    );
  } else {
    {
      setPopupVisible(false);
    }
    return null;
  }
}

// Popup to add a new event
function AddEvent({ setPopupVisible }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(""); // used for both date and time
  const [venue, setVenue] = useState("");
  const [description, setDescription] = useState("");
  const [showError, setShowError] = useState(false);

  let { gardenId, setLoading, setEvents } = useContext(GardenContext);

  function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);

    const values = {
      garden: parseInt(gardenId),
      duration: "01:00:00",
      title,
      date,
      venue,
      description,
    };

    fetch("http://giv-project15.uni-muenster.de:9000/api/v1/events/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(values),
    })
      .then((res) => {
        if (res.status == 200) {
          res.json().then((result) => {
            setPopupVisible(false);
            fetchEvents(gardenId, setEvents);
          });
        } else {
          throw new Error("Something went wrong");
        }
      })
      .catch((err) => {
        setShowError(true);
      });
    setLoading(false);
  }

  return (
    <div className={styles.popup}>
      <div className={styles.popup_inner} onSubmit={handleSubmit}>
        <h3>New Event</h3>
        {showError ? (
          <ErrorAlert
            setShowError={setShowError}
            heading={"Ups"}
            message={"Something went wrong creating the event"}
          />
        ) : (
          <></>
        )}
        <Form>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Event name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="datetime-local"
              placeholder="Date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Location"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              as="textarea"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
  const { resources } = useContext(GardenContext);

  return (
    <div className={styles.pagePartContent}>
      <h2>Shareables</h2>
      <div className={styles.listing}>
        {resources.map((item) => (
          <ShareableItem key={item.resource_id} item={item} />
        ))}
      </div>
      <AddButton ExecuteFunction={AddShareable} />
    </div>
  );
}

function ShareableItem({ item }) {
  const [popupVisible, setPopupVisible] = useState(false);

  return (
    <div className={styles.listItem} onClick={() => setPopupVisible(true)}>
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
          {item.category}
          <h3>{item.resource_name}</h3>
        </div>
      </div>
      {popupVisible && (
        <ItemDetails item={item} setPopupVisible={setPopupVisible} />
      )}
    </div>
  );
}

/*
Popup to display details of each sharable item,
e.g. description, status, return date
*/
function ItemDetails({ item, setPopupVisible }) {
  /*
  I know this looks like really strange programming...
  For some  reason I was not able to manage to get x-button
  to change state using setPopupVisible() directly.
  But it does work when executing this function in the else{} clause...
  Hence this strange construct here...
  */
  const [visible, setVisible] = useState(true);
  if (visible) {
    return (
      <div className={styles.popup}>
        <div className={styles.popup_inner}>
          <h3>{item.resource_name}</h3>
          {item.resource_status}
          <br />
          {item.resource_status === "BORROWED"
            ? "Available again: " +
              new Date(item.return_date).toLocaleDateString()
            : null}
          <hr />
          {item.description}
          <button
            className={styles.popupCloseButton}
            onClick={() => setVisible(false)}
          >
            X
          </button>
        </div>
      </div>
    );
  } else {
    {
      setPopupVisible(false);
    }
    return null;
  }
}

// Popup to add a new shareable
function AddShareable({ setPopupVisible }) {
  const [resource_name, setResourceName] = useState("");
  const [category, setCategory] = useState(0);
  const [showError, setShowError] = useState(false);

  let { gardenId, setLoading, setResources } = useContext(GardenContext);

  function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);

    const values = {
      garden: gardenId,
      resource_status: "AVAILABLE FOR BORROWING",
      date_created: Date.now(),
      resource_name,
      category,
    };

    fetch(
      "http://giv-project15.uni-muenster.de:9000/api/v1/gardens/resources/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(values),
      }
    )
      .then((res) => {
        if (res.status == 200) {
          res.json().then((result) => {
            setPopupVisible(false);
            fetchEvents(gardenId, setResources);
          });
        } else {
          throw new Error("Something went wrong");
        }
      })
      .catch((err) => {
        setShowError(true);
      });
    setLoading(false);
  }

  return (
    <div className={styles.popup}>
      <div className={styles.popup_inner} onSubmit={handleSubmit}>
        <h3>New Shareable</h3>
        {showError ? (
          <ErrorAlert
            setShowError={setShowError}
            heading="Ups"
            message="Something weng wrong creating the shareable resource"
          />
        ) : (
          <></>
        )}
        <Form>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Shareable name"
              value={resource_name}
              onChange={(e) => setResourceName(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Category</Form.Label>
            <Form.Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
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

/*
Alert component displaying when there is an error in POSTing a new event our resource
*/
function ErrorAlert({ setShowError, heading, message }) {
  return (
    <>
      <Alert
        className="alertInPopup"
        variant="danger"
        onClose={() => setShowError(false)}
        dismissible
      >
        <Alert.Heading>{heading}</Alert.Heading>
        <p>{message}</p>
      </Alert>
    </>
  );
}

export default garden;
