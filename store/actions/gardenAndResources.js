export const SET_GARDEN_LOCATIONS = "SET_GARDEN_LOCATIONS";
export const SET_RESOURCES = "SET_RESOURCES";

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
