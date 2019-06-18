import { DATA_SOURCES_LOADING, GET_DATA_SOURCES } from "../actions/types";

const initialState = {
  datasources: {},
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case DATA_SOURCES_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_DATA_SOURCES:
      return {
        ...state,
        datasources: action.payload,
        loading: false
      };
    default:
      return state;
  }
}
