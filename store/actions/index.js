export const SET_LANGUAGE = "SET_LANGUAGE";
export const SET_LOCATION_ACTIVE = "SET_LOCATION_ACTIVE";

export const SET_CURRENT_POINT = "SET_CURRENT_POINT";
//action for setting the language of the page to (currently available) Englisch or German
export const setLanguage = (language) => {
  return {
    type: "SET_LANGUAGE",
    payload: { language: language },
  };
};

export const setLocationActive = (active) => {
  return {
    type: "SET_LOCATION_ACTIVE",
    payload: { active: active },
  };
};

//action for setting the currently chosen garden on map page
export const setCurrentPoint = (gardenId) => {
  return {
    type: "SET_CURRENT_POINT",
    payload: { gardenId: gardenId },
  };
};