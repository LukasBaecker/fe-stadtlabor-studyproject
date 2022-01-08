import { SET_FILTERCATEGORIES } from "../actions/gardenAndResources.js";

const initialState = [];

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_FILTERCATEGORIES:
      let categories = action.payload.resources;
      state = categories;
      return state;
    default:
      return state;
  }
}
