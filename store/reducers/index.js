import { combineReducers } from "redux";
import authReducer from "./authReducer.js";
import gardenLocationReducer from "./gardenLocationReducer.js";
import resourcesReducer from "./resourcesReducer.js";
import languageReducer from "./languageReducer.js";
import locationActiveReducer from "./locationActiveReducer.js";

const rootReducer = combineReducers({
  auth: authReducer,
  lang: languageReducer,
  locations: gardenLocationReducer,
  resources: resourcesReducer,
  location_active: locationActiveReducer,
});

export default rootReducer;
