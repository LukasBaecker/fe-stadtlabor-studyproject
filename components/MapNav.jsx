import React, { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentPoint, setLocationActive } from "../store/actions";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import isEmpty from "../helpers/isEmpty";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { joinGarden } from "../helpers/manageGarden";
import { useRouter } from "next/router";
import {
  faListUl,
  faMapMarkerAlt,
  faFilter,
  faCheck,
  faBullseye,
  faInfo,
} from "@fortawesome/free-solid-svg-icons";
import filteredLocationsReducer from "../store/reducers/filteredLocationsReducer";
import { setFilteredLocations } from "../store/actions/gardenAndResources";

const MapNav = (props) => {
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);
  const dispatch = useDispatch();
  const [showFilters, setShowFilters] = useState(false);
  const [showList, setShowList] = useState(false);
  const locationActive = useSelector((state) => state.location_active);
  const lang = useSelector((state) => state.lang);
  const filtercategories = useSelector((state) => state.filtercategories);
  const [scrollTop, setScrollTop] = useState(true);
  const [scrollTopFilter, setScrollTopFilter] = useState(true);
  const listInnerRef = useRef();
  const filterInnerRef = useRef();

  const onScrollList = () => {
    if (listInnerRef.current) {
      const { scrollTop } = listInnerRef.current;
      if (scrollTop < 5) {
        setScrollTop(true);
      } else {
        setScrollTop(false);
      }
    }
  };

  const onScrollFilter = () => {
    if (filterInnerRef.current) {
      const { scrollTopFilter } = filterInnerRef.current;
      if (scrollTopFilter < 5) {
        setScrollTopFilter(true);
      } else {
        setScrollTopFilter(false);
      }
    }
  };

  function useOutsideAlerter(ref) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setShowFilters(false);
          setShowList(false);
        }
      }

      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  return (
    <>
      <div ref={wrapperRef}>
        {props.children}
        <Container className='mapNav'>
          <Row>
            <Col
              className={locationActive ? "activeLocation" : ""}
              id='colFirst'
              onClick={() => {
                dispatch(setLocationActive(!locationActive));
              }}>
              {" "}
              <FontAwesomeIcon className='mapNavIcon' icon={faMapMarkerAlt} />
            </Col>
            <Col
              onClick={() => {
                setShowList(false);
                setShowFilters(!showFilters);
              }}>
              {" "}
              <FontAwesomeIcon className='mapNavIcon' icon={faFilter} />
            </Col>

            <Col
              id='colLast'
              onClick={() => {
                setShowFilters(false);
                setShowList(!showList);
              }}>
              <FontAwesomeIcon className='mapNavIcon' icon={faListUl} />
            </Col>
          </Row>
        </Container>
        <div
          className={
            showFilters
              ? "mapNavExtraContainer filterContainer"
              : "mapNavExtraContainer hidden"
          }
          onScroll={() => onScrollFilter()}
          ref={filterInnerRef}>
          <h2>Filter</h2>
          <ScrollWheel scrollTop={scrollTopFilter} />
          <p className='advice'>
            {lang === "eng"
              ? "by resource-categories: First choose the categories you want to enable/disable and then click on the button bellow to confirm."
              : "nach Ressourcen-Kategorien: Wähle die gewünschten Kategorien und wende den Filter mit Klick auf den Button an."}
          </p>
          <FiltercategorieList />
        </div>
        <div
          className={
            showList
              ? "mapNavExtraContainer listContainer"
              : "mapNavExtraContainer hidden"
          }
          onScroll={() => onScrollList()}
          ref={listInnerRef}>
          <h2>List of Gardens</h2>
          <ScrollWheel scrollTop={scrollTop} />
          <p className='advice'>
            {locationActive
              ? lang === "eng"
                ? "The list is sorted by nearest gardens first"
                : "Die Liste ist nach der Entfernung zu den Gärten sortiert."
              : lang === "eng"
              ? "Activate your device location to see the distance from your place to the garden locations."
              : "Aktiviere den Ortungsdienst, um die Entfernung zu den Gärten zu sehen."}
          </p>
          <Dropdown.Divider />
          <GardenList user={props.user} />
        </div>
      </div>
    </>
  );
};

/*
 *Component for the Popup showing all filtering options to filter garden locations on the map
 */
const FiltercategorieList = (props) => {
  const lang = useSelector((state) => state.lang);
  const dispatch = useDispatch();
  //all possible categories
  const categories = [
    "Tools",
    "Seeds",
    "Fertilizers",
    "Compost",
    "ConstructionMaterial",
    "Gardens",
    "Other",
  ];
  const translateCat = (cat) => {
    if (cat === "Tools") {
      return "Werkzeuge";
    }
    if (cat === "Seeds") {
      return "Saatgut";
    }
    if (cat === "Fertilizers") {
      return "Dünger";
    }
    if (cat === "Compost") {
      return "Kompost";
    }
    if (cat === "ConstructionMaterial") {
      return "Baumaterial";
    }
    if (cat === "Gardens") {
      return "Gärten";
    }
    if (cat === "Other") {
      return "Andere";
    }
    return cat;
  };
  //load all gardenlocations to filter from
  const locations = useSelector((state) => state.locations);
  //TODO: in future work the resources can be filtered or even searched for
  //load all resources to show in the filter menu
  const resources = useSelector((state) => state.resources);
  //state to safe wich categories are active or not
  const [filterlist, setFilterlist] = useState({
    Tools: true,
    Seeds: true,
    Fertilizers: true,
    Compost: true,
    ConstructionMaterial: true,
    Gardens: true,
    Other: true,
    all: true,
    noResources: true,
  });
  //change one element in the status
  const setOneFilterElement = (element, boolean) => {
    setFilterlist((filterlist) => {
      return { ...filterlist, [element]: boolean, all: false };
    });
  };
  //activate oder deactivate all categories
  const setAllFilterElements = (boolean) => {
    Object.keys(filterlist).forEach((e) => {
      setFilterlist((filterlist) => {
        return { ...filterlist, [e]: boolean };
      });
    });
  };
  //submitting the current filtering selection and save the filtered locations to the redux store
  const getFilteredLocations = () => {
    var filteredResources = [];
    var gardenIds = [];
    var filteredGardens = [];
    if (filterlist.all) {
      dispatch(setFilteredLocations(locations));
    } else {
      Object.keys(filterlist).forEach((e) => {
        var thisResource = [];
        var positionOfCat = 1 + categories.indexOf(e, 0);

        if (filterlist[e]) {
          if (positionOfCat > 0) {
            thisResource = resources.filter(
              (resource) => resource.category === positionOfCat
            );
            thisResource.forEach((elem) => {
              filteredResources.push(elem);
            });
          }
        }
      });

      filteredResources.forEach((r) => {
        if (!gardenIds.includes(r.garden)) {
          gardenIds.push(r.garden);
        }
      });
      locations.features.forEach((g) => {
        if (
          gardenIds.includes(g.id) ||
          (filterlist.noResources && g.properties.resources.length === 0)
        ) {
          filteredGardens.push(g);
        }
      });
      var newCollection = { ...locations, features: filteredGardens };

      dispatch(setFilteredLocations(newCollection));
    }
  };
  //add all categories to the menu by mapping a div for each
  const listItems = categories.map((element) => (
    <div
      key={element}
      onClick={() => {
        setOneFilterElement(element, !filterlist[element]);
      }}
      className={
        filterlist[element] ? "filterElement checked" : "filterElement "
      }>
      <FontAwesomeIcon className='filterCheck' icon={faCheck} />
      {lang === "eng" ? element : translateCat(element)}
    </div>
  ));

  return (
    <>
      <div>
        <div
          key='all'
          onClick={() => {
            setAllFilterElements(!filterlist.all);
          }}
          className={
            filterlist.all ? "filterElement checked" : "filterElement"
          }>
          <FontAwesomeIcon className='filterCheck' icon={faCheck} />
          {lang === "eng" ? "all" : "alles"}
        </div>
        <Dropdown.Divider />
        {listItems}
      </div>
      <Dropdown.Divider />
      <div
        key='noResources'
        onClick={() => {
          setOneFilterElement("noResources", !filterlist.noResources);
        }}
        className={
          filterlist.noResources ? "filterElement checked" : "filterElement"
        }>
        <FontAwesomeIcon className='filterCheck' icon={faCheck} />
        {lang === "eng"
          ? "show also gardens with no resources"
          : "zeige Gärten ohne Ressourcen an"}
      </div>
      <Button
        onClick={() => {
          getFilteredLocations();
        }}
        className='filterButton'>
        Filter
      </Button>
    </>
  );
};
/*
 *Component for the Navigation Popup showing a list of all gardens
 */
const GardenList = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const currentPoint = useSelector((state) => state.currentPoint);
  const filteredLocations = useSelector((state) => state.filtered_locations);
  const resources = useSelector((state) => state.resources);
  const lang = useSelector((state) => state.lang);

  const getResourceInformation = (id) => {
    let resourceInformation = {};
    resources.forEach((r) => {
      if (r.resource_id === id) {
        resourceInformation = r;
      }
    });
    return resourceInformation;
  };
  const distance = (dist) => {
    const distKm = Math.round((Number(dist.slice(0, -2)) / 1000) * 10) / 10;
    return (
      <p>
        <Image src='/icons/person-walking-solid.svg' />
        {distKm}
        {"km"}
      </p>
    );
  };

  const gardenListReturner = () => {
    if (filteredLocations.features === undefined) {
      return <p>please wait</p>;
    } else {
      return filteredLocations.features.map((e) => (
        <>
          <div
            key={"gardenlistelement" + e.id}
            className={
              currentPoint === e.id ? "activeGardenDiv gardenDiv" : "gardenDiv"
            }
            onClick={() => {
              dispatch(setCurrentPoint(e.id));
            }}>
            <h4>
              {currentPoint === e.id ? <Image src='/imgs/marker.svg' /> : <></>}
              {e.properties.name}
            </h4>

            <p>
              {e.properties.address} | {e.properties.email}
            </p>
            {e.properties.distance != 0 ? (
              distance(e.properties.distance)
            ) : (
              <></>
            )}

            <p>
              {lang === "eng" ? "Resources" : "Ressourcen"} (
              {e.properties.resources.length}){" "}
            </p>
            <ul>
              {e.properties.resources.map((element) => (
                <li key={"listelement" + element}>
                  {getResourceInformation(element).resource_name} (
                  {getResourceInformation(element).resource_status ===
                  "AVAILABLE FOR DONATION"
                    ? lang === "eng"
                      ? "donation"
                      : "abzugeben"
                    : lang === "eng"
                    ? "to borrow"
                    : "zu verleihen"}
                  )
                </li>
              ))}
            </ul>
            <Button
              className='infoButton'
              onClick={() => {
                router.push("/garden/" + e.id);
              }}>
              <FontAwesomeIcon icon={faInfo} />
            </Button>
            {!isEmpty(props.user) ? (
              props.user.garden.includes(e.id) ? (
                <Button
                  variant='secondary'
                  className='join'
                  onClick={() => {}}
                  disabled>
                  {lang === "eng" ? "Member" : "Mitglied"}
                </Button>
              ) : (
                <JoinButton userDetails={props.user} gardenId={e.id} />
              )
            ) : null}
          </div>
          <Dropdown.Divider key={"divider" + e.id} />
        </>
      ));
    }
  };
  return <> {gardenListReturner()}</>;
};

const ScrollWheel = (props) => {
  return (
    <div
      className={
        props.scrollTop ? "scrolldown-wrapper" : "scrolldown-wrapper hidden"
      }>
      <div className='scrolldown'>
        <svg height='30' width='10'>
          <circle className='scrolldown-p1' cx='5' cy='15' r='2' />
          <circle className='scrolldown-p2' cx='5' cy='15' r='2' />
        </svg>
      </div>
    </div>
  );
};
const JoinButton = (props) => {
  const lang = useSelector((state) => state.lang);
  const router = useRouter();
  const handleTheClick = async (userDetails, gardenId) => {
    const success = await joinGarden(userDetails, gardenId);
    if (success) {
      router.reload();
    } else {
      console.log("not successful");
    }
  };

  return (
    <>
      <Button
        className='join'
        onClick={() => {
          handleTheClick(props.userDetails, props.gardenId);
        }}>
        {lang === "eng" ? "Join" : "Beitreten"}
      </Button>
    </>
  );
};

export default MapNav;
