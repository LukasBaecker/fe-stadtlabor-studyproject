import React, { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
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
} from "@fortawesome/free-solid-svg-icons";

const MapNav = (props) => {
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);

  const dispatch = useDispatch();
  const [showFilters, setShowFilters] = useState(false);
  const [showList, setShowList] = useState(false);
  const locationActive = useSelector((state) => state.location_active);

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
          <p>here are some filters</p>
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

export default MapNav;
