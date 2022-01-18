/**
 * Function to register the currently logged-in user to a garden
 * @param {json} user JSON-object of the user, like it is returned from the User-API
 * @param {int} gardenId ID of the garden, to which the user should be added
 * @returns {Promise<boolean>} Indiates, whether registering the user to the garden was successful
 */
async function joinGarden(user, gardenId) {
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

export default joinGarden;
