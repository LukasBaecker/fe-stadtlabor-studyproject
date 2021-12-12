import setAuthToken from "../../helpers/setAuthToken";
import jwt_decode from "jwt-decode";

export const SET_CURRENT_USER = "SET_CURRENT_USER";

export const loginUser = (user) => (dispatch) => {
  const { token } = user.data;
  localStorage.setItem("jwtToken", token);
  setAuthToken(token);
  const decoded = jwt_decode(token);
  dispatch(setCurrentUser(decoded));
};

export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
  };
};

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem("jwtToken");
  setAuthToken(false);
  dispatch(setCurrentUser({}));
};
