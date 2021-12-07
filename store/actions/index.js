export const SET_LANGUAGE = "SET_LANGUAGE";

//action for setting the language of the page to (currently available) Englisch or German
export const setLanguage = (language) => {
  return {
    type: "SET_LANGUAGE",
    payload: { language: language },
  };
};
