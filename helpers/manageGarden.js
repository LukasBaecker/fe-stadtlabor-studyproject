/**
 * Function to create a new garden
 * @param {json} values JSON-object of values passed to Garden-POST API
 * @returns {Promise<int>} ID of newly created garden, -1 for error
 */
export async function createGarden(values) {
  const response = await fetch(
    "http://giv-project15.uni-muenster.de:9000/api/v1/gardens/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(values),
    }
  );
  const content = await response.json();

  return new Promise((resolve, reject) => {
    if (response.status == 200) {
      resolve(content.id);
    } else {
      reject(-1);
    }
  });
}

/**
 * Function to register the currently logged-in user to a garden
 * @param {json} user JSON-object of the user, like it is returned from the User-API
 * @param {int} gardenId ID of the garden, to which the user should be added
 * @returns {Promise<boolean>} Indiates, whether registering the user to the garden was successful
 */
export async function joinGarden(user, gardenId) {
  delete user["email"];
  delete user["id"];
  user["garden"] = [...user["garden"], gardenId];

  const response = await fetch(
    "http://giv-project15.uni-muenster.de:9000/api/v1/users/user",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(user),
    }
  );

  return new Promise((resolve, reject) => {
    if (response.status == 200) {
      resolve(true);
    } else {
      reject(false);
    }
  });
}

/**
 *
 * @param {json} user JSON-object of the current user, like it is returned from the User-API
 * @param {*} gardenId ID of the garden, from which a user likes to un-register
 * @returns {Promise<boolean>} Indicates, whether leaving the garden was successful
 */
export async function leaveGarden(user, gardenId) {
  delete user["email"];
  delete user["id"];
  user["garden"] = user["garden"].filter((item) => item !== parseInt(gardenId));

  const response = await fetch(
    "http://giv-project15.uni-muenster.de:9000/api/v1/users/user",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(user),
    }
  );

  return new Promise((resolve, reject) => {
    if (response.status == 200) {
      resolve(true);
    } else {
      reject(false);
    }
  });
}

/**
 * Function to delete a garden
 * @param {int} id ID of the garden to be deleted
 * @returns {Promise<boolean>} Indicates, whether deleting the garden was successful
 */
export async function deleteGarden(id) {
  const deleteRequest = await fetch(
    `http://giv-project15.uni-muenster.de:9000/api/v1/gardens/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  return new Promise((resolve, reject) => {
    if (deleteRequest.status == 200) {
      resolve(true);
    } else {
      reject(false);
    }
  });
}
