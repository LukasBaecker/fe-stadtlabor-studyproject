import React, { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import { Formik, Field, Form } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { setLocationActive } from "../store/actions";
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
              onClick={() => {
                setShowFilters(false);
                setShowList(!showList);
              }}>
              {" "}
              <FontAwesomeIcon className='mapNavIcon' icon={faListUl} />
            </Col>
            <Col id='colLast'>
              {" "}
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
          <FiltercategorieList categories={filtercategories} />
        </div>
        <div
          className={
            showList
              ? "mapNavExtraContainer listContainer"
              : "mapNavExtraContainer hidden"
          }>
          <h2>List of Gardens</h2>
          <Dropdown.Divider />
          <GardenList />
        </div>
      </div>
    </>
  );
};

const FiltercategorieList = (props) => {
  const dispatch = useDispatch();
  const categories = props.categories;
  const locations = useSelector((state) => state.locations);
  const resources = useSelector((state) => state.resources);
  const [filterlist, setFilterlist] = useState({});

  const setOneFilterElement = (element, boolean) => {
    setFilterlist((filterlist) => {
      return { ...filterlist, [element]: boolean, all: false };
    });
  };
  const setAllFilterElements = (boolean) => {
    Object.keys(filterlist).forEach((e) => {
      setFilterlist((filterlist) => {
        return { ...filterlist, [e]: boolean };
      });
    });
  };

  const initialState = () => {
    setFilterlist((filterlist) => {
      return { ...filterlist, all: true, noResources: true };
    });
    categories.forEach((e) => {
      setFilterlist((filterlist) => {
        return { ...filterlist, [e]: true };
      });
    });
  };

  useEffect(() => {
    initialState();
  }, []);

  const getFilteredLocations = () => {
    var filteredResources = [];
    var gardenIds = [];
    var filteredGardens = [];
    if (filterlist.all) {
      dispatch(setFilteredLocations(locations));
    } else {
      Object.keys(filterlist).forEach((e) => {
        var thisResource = [];
        if (filterlist[e]) {
          thisResource = resources.filter(
            (resource) => resource.resource_name === e
          );
          thisResource.forEach((elem) => {
            filteredResources.push(elem);
          });
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
const GardenList = () => {
  const filteredLocations = useSelector((state) => state.filtered_locations);
  const resources = useSelector((state) => state.resources);

  const gardenListReturner = filteredLocations.features.map((e) => (
    <div key={e.id}>
      <h4>{e.properties.name}</h4>

      <p>
        {e.properties.address} | {e.properties.phone} | {e.properties.email}
      </p>

      <p>Resources ({e.properties.resources.length}) </p>

      <ul>
        {e.properties.resources.map((element) => (
          <li>
            {resources.find((e) => (e.resource_id = element)).resource_name} (
            {resources.find((e) => (e.resource_id = element)).resource_status})
          </li>
        ))}
      </ul>

      <Dropdown.Divider />
    </div>
  ));
  return <> {gardenListReturner}</>;
};
export default MapNav;

/*
http://giv-project15:9000/api/v1/gardens/all/get_nearest_gardens?x=9.99579&y=51.80490
*/
