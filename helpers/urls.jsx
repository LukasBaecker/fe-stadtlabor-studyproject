/**
 * File contains URLs to all backend endpoints used throughout this project
 */

const backendBaseUrl = "http://giv-project15.uni-muenster.de:8000";
const backendApiUrl = backendBaseUrl + "/api/v1";

export const userPutUrl = backendApiUrl + "/users/user";

export const gardenPostUrl = backendApiUrl + "/gardens/";

/**
 * Function to generate URL of delete Garden endpoint
 * @param {int} gardenId ID of the garden that sould be deleted
 * @returns {String} URL of API endpoint
 */
export function deleteGardenUrl(gardenId) {
  return backendApiUrl + `/gardens/${gardenId}`;
}
