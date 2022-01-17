import { SET_CURRENT_POINT } from "../actions";

const initialState = 0;

const currentPointReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_POINT:
      state = action.payload.gardenId;
      return state;
    default:
      return state;
  }
};

export default currentPointReducer;
