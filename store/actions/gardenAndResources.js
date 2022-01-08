export const SET_GARDEN_LOCATIONS = "SET_GARDEN_LOCATIONS";
export const SET_RESOURCES = "SET_RESOURCES";
export const SET_FILTERCATEGORIES = "SET_FILTERCATEGORIES";
export const SET_FILTERED_LOCATIONS = "SET_FILTERED_LOCATIONS";
export const setGardenLocations = (locations) => {
  return {
    type: "SET_GARDEN_LOCATIONS",
    payload: { locations: locations },
  };
};
export const setResources = (resources) => {
  return {
    type: "SET_RESOURCES",
    payload: { resources: resources },
  };
};
export const setFilterCategories = (resources) => {
  return {
    type: "SET_FILTERCATEGORIES",
    payload: { resources: resources },
  };
};
export const setFilteredLocations = (locations) => {
  return {
    type: "SET_FILTERED_LOCATIONS",
    payload: { locations: locations },
  };
};
