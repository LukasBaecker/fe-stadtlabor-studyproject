/**
 * File contains URLs to all backend endpoints used throughout this project
 */

const backendBaseUrl = "http://giv-project15.uni-muenster.de:8000";
const backendApiUrl = backendBaseUrl + "/api/v1";

//URL to GET User details
export const userGetUrl = backendApiUrl + "/users/user";

//URL to PUT user Details
export const userPutUrl = backendApiUrl + "/users/user";

//URL to register new User (POST)
export const userRegisterPostUrl = backendApiUrl + "/users/register";

//URL to Login a user (POST)
export const userLoginPostUrl = backendApiUrl + "/users/login";

//URL to Logout a user (POST)
export const userLogoutPostUrl = backendApiUrl + "/users/logout";

//URL to create a new garden (POST)
export const gardenPostUrl = backendApiUrl + "/gardens/";

/**
 * function generates URL to GET the nearest garden
 * @param {number} x x-parameter to pass to URL
 * @param {number} y y-parameter to pass to URL
 * @returns {string} URL to GET nearest gardens
 */
export function gardenGetNearestUrl(x, y) {
  return backendApiUrl + `/gardens/all/get_nearest_gardens?x=${x}&y=x=${y}`;
}

/**
 * Function to generate URL of get specific Garden endpoint
 * @param {number} gardenId ID of the garden that sould be gotten
 * @returns {String} URL of API endpoint
 */
export function getGardenUrl(gardenId) {
  return backendApiUrl + `/gardens/all/${gardenId}/`;
}

/**
 * Function to generate URL of delete Garden endpoint
 * @param {number} gardenId ID of the garden that sould be deleted
 * @returns {String} URL of API endpoint
 */
export function deleteGardenUrl(gardenId) {
  return backendApiUrl + `/gardens/${gardenId}`;
}

//URL to fetch all events (GET)
export const eventsGetUrl = backendApiUrl + "/events/all";

//URL to POST a new event
export const eventsPostUrl = backendApiUrl + "/events/";

/**
 * function to generate a URL to DELETE an event
 * @param {number} eventId ID of the event that is to delete
 * @returns {string} URL of item that is to be deleted
 */
export function eventDeleteUrl(eventId) {
  return backendApiUrl + `/events/${eventId}`;
}

//URL to fetch all resources (GET)
export const resourcesGetUrl = backendApiUrl + "/gardens/resources/all";

//URL to create a new resource (POST)
export const resourcePostUrl = backendApiUrl + "/gardens/resources/";

/**
 * function to generate a URL to DELETE a resource
 * @param {number} resourceId ID of the resource that is to be deleted
 * @returns {string} URL of item that is to be deleted
 */
export function resourceDeleteUrl(resourceId) {
  return backendApiUrl + `/gardens/resources/${resourceId}`;
}