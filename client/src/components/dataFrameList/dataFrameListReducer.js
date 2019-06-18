import {
  DATAFRAMES_LOADING,
  GET_DATAFRAMES_SUCCESS,
  GET_DATAFRAMES_ERROR
} from "./dataFrameListTypes";

const initialState = {
  dataframes: [],
  loading: false,
  error_message: ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    case DATAFRAMES_LOADING:
      return {
        ...state,
        dataframes: [],
        loading: true,
        error_message: ""
      };
    case GET_DATAFRAMES_SUCCESS:
      return {
        ...state,
        dataframes: action.payload,
        loading: false,
        error_message: ""
      };
    case GET_DATAFRAMES_ERROR:
      return {
        ...state,
        dataframes: [],
        loading: false,
        error_message: action.error_message
      };
    default:
      return state;
  }
}
