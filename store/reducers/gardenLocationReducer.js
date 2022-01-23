import { SET_GARDEN_LOCATIONS } from "../actions/gardenAndResources.js";

const initialState = {};

const gardenLocationReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_GARDEN_LOCATIONS:
      let locations = action.payload.locations;
      state = locations;
      return state;
    default:
      return state;
  }
};

export default gardenLocationReducer;
