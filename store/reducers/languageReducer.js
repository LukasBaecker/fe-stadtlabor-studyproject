import { SET_LANGUAGE } from "../actions";

const initialState = "ger";

const languageReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LANGUAGE:
      let lang = action.payload.language;
      state = lang;
      return state;
    default:
      return state;
  }
};

export default languageReducer;
