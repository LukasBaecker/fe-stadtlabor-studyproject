import React from "react";
import Spinner from "react-bootstrap/Spinner";

function Loader() {
  return (
    <>
      <div className="loader">
        {" "}
        <Spinner
          animation="border"
          className="loader-spinner"
          variant="secondary"
        />
      </div>
      ;
    </>
  );
}

export function CenterSpinner() {
  return (
    <div className="spinnerDiv">
      <Spinner animation="border" role="status" variant="secondary"></Spinner>
    </div>
  );
}

export default Loader;
