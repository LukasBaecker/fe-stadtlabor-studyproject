import { SET_FILTERCATEGORIES } from "../actions/gardenAndResources.js";

const initialState = [];

const filtercategoriesReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_FILTERCATEGORIES:
      let categories = action.payload.categories;
      state = categories;
      return state;
    default:
      return state;
  }
};

export default filtercategoriesReducer;
