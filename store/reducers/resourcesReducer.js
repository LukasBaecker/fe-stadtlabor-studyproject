import { SET_RESOURCES } from "../actions/gardenAndResources.js";

const initialState = {};

const resourcesReducer =(state = initialState, action) => {
  switch (action.type) {
    case SET_RESOURCES:
      let resources = action.payload.resources;
      state = resources;
      return state;
    default:
      return state;
  }
}

export default resourcesReducer