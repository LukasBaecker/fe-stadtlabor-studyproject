import React, { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import { Formik, Field, Form } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentPoint, setLocationActive } from "../store/actions";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faListUl,
  faMapMarkerAlt,
  faFilter,
  faCheck,
  faBullseye,
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
          }>
          <h2>Filter</h2>
          <FiltercategorieList />
        </div>
        <div
          className={
            showList
              ? "mapNavExtraContainer listContainer"
              : "mapNavExtraContainer hidden"
          }>
          <div className='sortList'>
            <img
              src='/icons/arrow-down-short-wide-solid.svg'
              alt='sort the list'
            />
            {lang === "eng" ? "nearest first" : "in der Nähe zuerst"}
          </div>

          <h2>List of Gardens</h2>
          <Dropdown.Divider />
          <GardenList />
        </div>
      </div>
    </>
  );
};

/*
 *Component for the Popup showing all filtering options to filter garden locations on the map
 */
const FiltercategorieList = (props) => {
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
      {element}
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
          all
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
        show gardens with no resources
      </div>
      <Button
        onClick={() => {
          getFilteredLocations();
        }}>
        Filter
      </Button>
    </>
  );
};
/*
 *Component for the Navigation Popup showing a list of all gardens
 */
const GardenList = () => {
  const dispatch = useDispatch();
  const currentPoint = useSelector((state) => state.currentPoint);
  const filteredLocations = useSelector((state) => state.filtered_locations);
  const resources = useSelector((state) => state.resources);

  const getResourceInformation = (id) => {
    let resourceInformation = {};
    resources.forEach((r) => {
      if (r.resource_id === id) {
        resourceInformation = r;
      }
    });
    return resourceInformation;
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

            <p>Resources ({e.properties.resources.length}) </p>
            <ul>
              {e.properties.resources.map((element) => (
                <li key={"listelement" + element}>
                  {getResourceInformation(element).resource_name}(
                  {getResourceInformation(element).resource_status})
                </li>
              ))}
            </ul>
          </div>
          <Dropdown.Divider key={"divider" + e.id} />
        </>
      ));
    }
  };
  return <> {gardenListReturner()}</>;
};

export default MapNav;
