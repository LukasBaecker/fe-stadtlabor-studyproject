import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import { useDispatch, useSelector } from "react-redux";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListUl } from "@fortawesome/free-solid-svg-icons";

const MapNav = () => {
  const dispatch = useDispatch();

  return (
    <>
      <Container className='mapNav'>
        <Row>
          <Col id='colFirst'>
            {" "}
            <FontAwesomeIcon className='mapNavIcon' icon={faListUl} />
          </Col>
          <Col>
            {" "}
            <FontAwesomeIcon className='mapNavIcon' icon={faListUl} />
          </Col>
          <Col>
            {" "}
            <FontAwesomeIcon className='mapNavIcon' icon={faListUl} />
          </Col>
          <Col>
            {" "}
            <FontAwesomeIcon className='mapNavIcon' icon={faListUl} />
          </Col>
        </Row>
      </Container>
    </>
  );
};
export default MapNav;
