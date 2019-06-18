import { GET_PROJECT } from "../actions/types";

const initialState = {
  projectDetail: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_PROJECT:
      return {
        ...state,
        projectDetail: action.payload
      };
    default:
      return state;
  }
}
