import {SET_RESOURCES } from "../actions/gardenAndResources.js";

const initialState = {};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_RESOURCES:
      let resources = action.payload.resources;
      state = resources;
      return state;
    default:
      return state;
  }
};

