import isEmpty from "../validation/isEmpty";

import {
  SET_CURRENT_USER,
  UNSET_CURRENT_USER,
  SET_TOKEN
} from "../actions/types";

const initialState = {
  isAuthenticated: false,
  user: {},
  organization: {},
  token: ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_TOKEN:
      return {
        ...state,
        token: action.payload
      };
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload["user"],
        organization: action.payload["organization"]
      };
    case UNSET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: false,
        user: {},
        organization: {},
        token: ""
      };
    default:
      return state;
  }
}
