import { combineReducers } from "redux";
import authReducer from "./authReducer.js";
import gardenLocationReducer from "./gardenLocationReducer.js";
import resourcesReducer from "./resourcesReducer.js";
import languageReducer from "./languageReducer.js";
import locationActiveReducer from "./locationActiveReducer.js";
import filtercategoriesReducer from "./filtercategoriesReducer.js";
import filteredLocationsReducer from "./filteredLocationsReducer.js";
import currentPointReducer from "./currentPointReducer.js";

const rootReducer = combineReducers({
  auth: authReducer,
  lang: languageReducer,
  locations: gardenLocationReducer,
  filtered_locations: filteredLocationsReducer,
  resources: resourcesReducer,
  location_active: locationActiveReducer,
  filtercategories: filtercategoriesReducer,
  currentPoint: currentPointReducer,
});

export default rootReducer;
