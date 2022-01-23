import { SET_FILTERED_LOCATIONS } from "../actions/gardenAndResources.js";

const initialState = {};

const filteredLocationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_FILTERED_LOCATIONS:
      let locations = action.payload.locations;
      state = locations;
      return state;
    default:
      return state;
  }
};

export default filteredLocationsReducer;
