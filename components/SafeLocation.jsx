import React from "react";
import { useDispatch, useSelector } from "react-redux";
import UpdateLocation from "./UpdateLocation.jsx";
const SafeLocation = (props) => {
  const dispatch = useDispatch();
  const locationPosition = useSelector((state) => state.location_position);

  return <> {locationPosition[0] != -1 ? <UpdateLocation /> : <></>}</>;
};
export default SafeLocation;
