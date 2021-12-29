import { SET_GARDEN_LOCATIONS } from "../actions/gardenAndResources.js";

const initialState = {};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_GARDEN_LOCATIONS:
      let locations = action.payload.locations;
      state = locations;
      return state;
    default:
      return state;
  }
}
