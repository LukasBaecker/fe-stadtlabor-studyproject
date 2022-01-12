import React, { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import { Formik, Field, Form } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { setLocationActive } from "../store/actions";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
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
          <h3>Filter</h3>
          <FiltercategorieList categories={filtercategories} />
        </div>
        <div
          className={
            showList
              ? "mapNavExtraContainer listContainer"
              : "mapNavExtraContainer hidden"
          }>
          <p>here is a list of all gardens</p>
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
      console.log(newCollection);
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

        {listItems}
      </div>
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

export default MapNav;
