import Head from "next/head";
import router, { useRouter } from "next/router";

import Header from "../../../components/Header";
import { CenterSpinner } from "../../../components/Loader";
import { joinGarden, leaveGarden } from "../../../helpers/manageGarden";
import {
  eventsGetUrl,
  resourcesGetUrl,
  userGetUrl,
  getGardenUrl,
  eventsPostUrl,
  eventDeleteUrl,
  resourceDeleteUrl,
  resourcePostUrl,
  userGetById,
  cropsGetUrl,
} from "../../../helpers/urls";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
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
    const request = await fetch(eventsGetUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const cont = await request.json();
    const evts = cont.filter((evt) => evt.garden == id);
    setEvents(evts);
  } catch (e) {
    console.log(e);
  }
}

async function fetchCrops(id, setCrops) {
  try {
    const request = await fetch(cropsGetUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (request.status === 200) {
      const crops = await request.json();
      const cropsFiltered = crops.filter((crop) =>
        crop.gardens.includes(parseInt(id))
      );
      setCrops(cropsFiltered);
    } else {
      throw new Error("Something went wrong fetching crops");
    }
  } catch (e) {
    console.log(e);
  }
}

/**
 * Function to fetch all members of a garden
 * @param {Array.<number>} ids List of ids of users to fetch
 * @param {function} setMembers function to set Members
 */
async function fetchMembers(ids, setMembers) {
  const getMemberById = async (userId) => {
    const userRequest = await fetch(userGetById(userId), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    return new Promise(async (resolve, reject) => {
      if (userRequest.status === 200) {
        resolve(await userRequest.json());
      } else {
        reject({ id: userId, first_name: "unknown", last_name: "error" });
      }
    });
  };

  const memberList = [];
  for (let i = 0; i < ids.length; i++) {
    const user = await getMemberById(ids[i]);
    delete user.email;
    delete user.garden;
    memberList.push(user);
  }
  setMembers(memberList);
}

/*
Function to fetch all resources in database,
then filters them by garden-id to only show the relevant ones
*/
async function fetchResources(id, setResources) {
  // Fetch Resources
  try {
    const request = await fetch(resourcesGetUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
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

  const [gardenDetails, setGardenDetails] = useState("");
  const [events, setEvents] = useState([]);
  const [resources, setResources] = useState([]);
  const [members, setMembers] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [isMember, setIsMember] = useState(false);

  // controls if an error message is shown instead of the garden
  const [showError, setShowError] = useState(false);
  const [errorText, setErrorText] = useState(""); // Text within error message

  const [dataFetched, setDataFetched] = useState(false);
  useEffect(() => {
    if (id && !dataFetched) {
      (async () => {
        // check if user is logged in
        try {
          const request = await fetch(userGetUrl, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          });
          const content = await request.json();
          if (content.detail === "Unauthenticated!") {
            console.log("unauthenticated");
          } else {
            setLoggedIn(true);
            setUserDetails(content);
            setIsMember(content.garden.includes(parseInt(id)));
          }
        } catch (e) {
          console.log("error: ", e);
        }

        // Fetch general garden information
        try {
          const request = await fetch(getGardenUrl(id), {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          });
          const cont = await request.json();
          if (cont.detail === "Not found.") {
            throw new Error("Garden not found");
          } else {
            setGardenDetails(cont.properties);
            fetchMembers(cont.properties.members, setMembers);
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
        fetchCrops(id, setCrops);
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
  // 5: Crops
  const [pageState, setPageState] = useState(1);

  return (
    <GardenContext.Provider
      value={{
        loggedIn,
        gardenDetails,
        gardenId: id,
        events,
        setEvents,
        resources,
        setResources,
        setLoading,
        pageState,
        setPageState,
        userDetails,
        members,
        isMember,
        crops,
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
  const { pageState, setPageState, gardenDetails, isMember } =
    useContext(GardenContext);
  return (
    <>
      <Head>
        <title>{gardenDetails.name}</title>
      </Head>

      {/* Set Header */}
      <Header
        caption=""
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
            {gardenDetails.primary_purpose == "GARDEN" && (
              <>
                {
                  // Only show list of members, if user is part of the garden
                  isMember && (
                    <Button variant="primary" onClick={() => setPageState(3)}>
                      <img
                        src="/imgs/icons8-benutzergruppen-100.png"
                        alt="Members"
                        className={styles.menuButtonIcon}
                      />
                    </Button>
                  )
                }
                <Button variant="primary" onClick={() => setPageState(2)}>
                  <img
                    src="/imgs/icons8-kalender-bearbeiten-100.png"
                    alt="Events"
                    className={styles.menuButtonIcon}
                  />
                </Button>
                <Button variant="primary" onClick={() => setPageState(5)}>
                  <img
                    src="/imgs/icons8-plant-60-white.png"
                    alt="Crops"
                    className={styles.menuButtonIcon}
                  />
                </Button>
              </>
            )}

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
        {pageState === 5 && <Crops />}
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
  const { gardenDetails, isMember } = useContext(GardenContext);

  return (
    <>
      <div className={styles.pagePartContent}>
        <h5>{gardenDetails.email}</h5>
        <h5>{gardenDetails.phone}</h5>
        <hr />
        {gardenDetails.description}
      </div>
      {isMember ? <LeaveButton /> : <JoinButton />}
    </>
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
  const { isMember } = useContext(GardenContext);
  if (visible) {
    return (
      <div className={styles.popup}>
        <div className={styles.popup_inner}>
          {new Date(event.date).toLocaleString()}
          <h3>{event.title}</h3>
          Location: {event.venue}
          <hr />
          {event.description}
          <br />
          {isMember && (
            <RemoveEvent
              eventId={event.event_id}
              setPopupVisible={setPopupVisible}
            />
          )}
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

    fetch(eventsPostUrl, {
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
Component to remove an event from a garden
*/
function RemoveEvent({ eventId, setPopupVisible }) {
  const { gardenId, setEvents } = useContext(GardenContext);

  const handleClick = async () => {
    try {
      const del = await fetch(eventDeleteUrl(eventId), {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (del.status === 204) {
        fetchEvents(gardenId, setEvents);
        setPopupVisible(false);
      } else {
        throw new Erorr("Something went wrong");
      }
    } catch (e) {
      console.log("error:", e);
    }
  };

  return (
    <Button
      variant="danger"
      className={styles.removeButton}
      onClick={() => handleClick()}
    >
      <img src="/imgs/icons8-delete-64.png" alt="Delete" />
    </Button>
  );
}

/* 
Members Page:
Rendered, when the user clicks the Members Button in ButtonGroup.
Shows all members of the community and their role (admin or normal member).
Admins can remove members or promote members to admins.
*/
function Members() {
  const { members } = useContext(GardenContext);

  return (
    <div className={styles.pagePartContent}>
      <h2>Members ({members.length})</h2>
      <div className={styles.listing}>
        {/* first show all admin members */}
        {members.map((member) => (
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
          <h3>{`${member.first_name} ${member.last_name}`}</h3>
        </div>
      </div>
    </div>
  );
}

/*
Crops Page:
Rendered, when the user clicks the Crops button in ButtonGroup.
*/
function Crops() {
  const { crops } = useContext(GardenContext);

  return (
    <div className={styles.pagePartContent}>
      <h2>Crops ({crops.length})</h2>
      <div className={styles.listing}>
        {/* first show all admin members */}
        {crops.map((crop) => (
          <Crop key={crop.crop_id} crop={crop} />
        ))}
      </div>
      <AddButton ExecuteFunction={AddCrop} />
    </div>
  );
}

function Crop({ crop }) {
  const [popupVisible, setPopupVisible] = useState(false);

  return (
    <div className={styles.listItem} onClick={() => setPopupVisible(true)}>
      <img
        src="/imgs/icons8-plant-60.png"
        alt="pictur of crop"
        className={
          // assign multiple classes to element
          [styles.listItemGraphic, styles.listItemGraphicImage].join(" ")
        }
      />
      <div className={styles.listItemContent}>
        <div className={styles.listItemDetail}>
          <h3>{crop.name}</h3>
        </div>
      </div>
      {popupVisible && (
        <CropDetail crop={crop} setPopupVisible={setPopupVisible} />
      )}
    </div>
  );
}

function CropDetail({ crop, setPopupVisible }) {
  /*
  I know this looks like really strange programming...
  For some  reason I was not able to manage to get x-button
  to change state using setPopupVisible() directly.
  But it does work when executing this function in the else{} clause...
  Hence this strange construct here...
  */

  const [visible, setVisible] = useState(true);
  const { isMember } = useContext(GardenContext);
  if (visible) {
    return (
      <div className={styles.popup}>
        <div className={styles.popup_inner}>
          <h3>{crop.name}</h3>
          <hr />
          {crop.description}
          {isMember && (
            <RemoveCrop
              cropId={crop.crop_id}
              setPopupVisible={setPopupVisible}
            />
          )}
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
    setPopupVisible(false);
    return null;
  }
}

function AddCrop({ setPopupVisible }) {
  const [showError, setShowError] = useState(false);

  const handleSubmit = () => {
    console.log("not implemented yet");
  };

  return (
    <div className={styles.popup}>
      <div className={styles.popup_inner} onSubmit={handleSubmit}>
        <h3>New Shareable</h3>
        {showError ? (
          <ErrorAlert
            setShowError={setShowError}
            heading="Ups"
            message="Something weng wrong creating crop"
          />
        ) : (
          <></>
        )}

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

function RemoveCrop({ cropId, setPopupVisible }) {
  const handleClick = async () => {
    console.log("not implemented yet");
  };

  return (
    <Button
      variant="danger"
      className={styles.removeButton}
      onClick={() => handleClick()}
    >
      <img src="/imgs/icons8-delete-64.png" alt="Delete" />
    </Button>
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

  const categoryLookup = {
    1: "Tool",
    2: "Seeds",
    3: "Fertelizer",
    4: "Compost",
    5: "Construction Material",
    6: "Gardens",
    7: "Other",
  };

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
          {categoryLookup[item.category]}
          <h3 style={{ marginBottom: "0" }}>{item.resource_name}</h3>
          {item.resource_status}
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
  const { isMember } = useContext(GardenContext);
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
          {isMember && (
            <RemoveShareable
              shareableId={item.resource_id}
              setPopupVisible={setPopupVisible}
            />
          )}
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

/*
Component to remove a shareable item from a garden
*/
function RemoveShareable({ shareableId, setPopupVisible }) {
  const { gardenId, setResources } = useContext(GardenContext);

  const handleClick = async () => {
    try {
      const del = await fetch(resourceDeleteUrl(shareableId), {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (del.status === 204) {
        fetchResources(gardenId, setResources);
        setPopupVisible(false);
      } else {
        throw new Erorr("Something went wrong");
      }
    } catch (e) {
      console.log("error:", e);
    }
  };

  return (
    <Button
      variant="danger"
      className={styles.removeButton}
      onClick={() => handleClick()}
    >
      <img src="/imgs/icons8-delete-64.png" alt="Delete" />
    </Button>
  );
}

// Popup to add a new shareable
function AddShareable({ setPopupVisible }) {
  const [resource_name, setResourceName] = useState("");
  const [category, setCategory] = useState(1);
  const [resource_status, setResourceStatus] = useState(
    "AVAILABLE FOR BORROWING"
  );
  const [description, setDescription] = useState("");
  const [showError, setShowError] = useState(false);

  let { gardenId, setLoading, setResources } = useContext(GardenContext);

  function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);

    const values = {
      garden: gardenId,
      resource_status,
      description,
      date_created: Date.now(),
      resource_name,
      category,
    };

    fetch(resourcePostUrl, {
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
            fetchResources(gardenId, setResources);
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
            <Form.Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="1">Tools</option>
              <option value="2">Seeds</option>
              <option value="3">Fertelizers</option>
              <option value="4">Compost</option>
              <option value="5">Cosntruction Material</option>
              <option value="6">Gardens</option>
              <option value="7">Other</option>
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Select
              value={resource_status}
              onChange={(e) => setResourceStatus(e.target.value)}
            >
              <option value="AVAILABLE FOR BORROWING">For borrowing</option>
              <option value="AVAILABLE FOR DONATION">For giveaway</option>
            </Form.Select>
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

  // only show button if user is logged in
  const { loggedIn, isMember } = useContext(GardenContext);

  const [popupVisible, setPopupVisible] = useState(false);

  return (
    <>
      {loggedIn && isMember ? (
        <>
          <Button
            onClick={() => setPopupVisible(true)}
            className={styles.addButtonNew}
            style={{ left: leftPosition }}
          >
            +
          </Button>
          {popupVisible && (
            <ExecuteFunction setPopupVisible={setPopupVisible} />
          )}
        </>
      ) : null}
    </>
  );
}

/*
Button to join the garden.
Only shows up when 
*/
function JoinButton() {
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

  // only show button if user is not logged in
  const { loggedIn, gardenId, userDetails } = useContext(GardenContext);

  const handleClick = async () => {
    const success = await joinGarden(userDetails, gardenId);
    if (success) {
      router.reload();
    } else {
      console.log("not successful");
    }
  };

  return (
    <>
      {loggedIn ? (
        <>
          <Button
            onClick={handleClick}
            className={styles.joinButton}
            style={{ left: leftPosition }}
          >
            Join!
          </Button>
        </>
      ) : null}
    </>
  );
}

/*
Button to join the garden.
Only shows up when 
*/
function LeaveButton() {
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

  // only show button if user is not logged in
  const { loggedIn, gardenId, userDetails } = useContext(GardenContext);

  const handleClick = async () => {
    const success = await leaveGarden(userDetails, gardenId);
    if (success) {
      router.reload();
    } else {
      console.log("not successful");
    }
  };

  return (
    <>
      {loggedIn ? (
        <>
          <Button
            onClick={handleClick}
            className={styles.joinButton}
            style={{ left: leftPosition }}
            variant="danger"
          >
            Leave!
          </Button>
        </>
      ) : null}
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
