import axios from "axios";
import setAxiosAuthToken from "../utils/setAxiosAuthToken";
import { push } from "connected-react-router";
import {
  GET_ERRORS,
  SET_CURRENT_USER,
  UNSET_CURRENT_USER,
  SET_TOKEN
} from "./types";

// Sign In User
export const signInUser = (userData, redirectTo) => dispatch => {
  setAxiosAuthToken("");
  axios
    .post("/api/v1/users/auth/token/login", userData)
    .then(res => {
      const { auth_token } = res.data;
      localStorage.setItem("token", auth_token);
      setAxiosAuthToken(auth_token);
      dispatch(setToken(auth_token));
      dispatch(getCurrentUser(redirectTo));
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

export const setCurrentUser = (user, organization, redirectTo) => dispatch => {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("organization", JSON.stringify(organization));
  dispatch({
    type: SET_CURRENT_USER,
    payload: {
      user: user,
      organization: organization
    }
  });

  if (redirectTo !== "") {
    dispatch(push(redirectTo));
  }
};

export const setToken = token => dispatch => {
  dispatch({
    type: SET_TOKEN,
    payload: token
  });
};

export const getCurrentUser = redirectTo => dispatch => {
  axios
    .get("/api/v1/users/me/")
    .then(res => {
      const user = {
        username: res.data["username"],
        email: res.data["email"]
      };
      dispatch(setCurrentUser(user, res.data["organizations"][0], redirectTo));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const unsetCurrentUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("organization");
  return {
    type: UNSET_CURRENT_USER
  };
};

// Log user out
export const signOutUser = () => dispatch => {
  setAxiosAuthToken("");
  dispatch(unsetCurrentUser());
  dispatch(push("/login"));
};
