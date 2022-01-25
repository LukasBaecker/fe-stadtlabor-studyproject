import { SET_LOCATION_POSITION } from "../actions";

const initialState = [-1, -1];

const locationPositionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOCATION_POSITION:
      let position = action.payload.position;
      state = position;
      return state;
    default:
      return state;
  }
};

export default locationPositionReducer;
