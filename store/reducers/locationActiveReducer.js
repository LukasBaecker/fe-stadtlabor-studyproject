import { SET_LOCATION_ACTIVE } from "../actions";

const initialState = false;

const locationActiveReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOCATION_ACTIVE:
      let active = action.payload.active;
      state = active;
      return state;
    default:
      return state;
  }
};

export default locationActiveReducer;
