import { combineReducers } from "redux";
import authReducer from "./authReducer.js";
import languageReducer from "./languageReducer.js";

const rootReducer = combineReducers({
  auth: authReducer,
  lang: languageReducer,
});

export default rootReducer;
