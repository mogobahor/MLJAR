import {
  GET_UPLOAD_DESTINATION,
  UPLOAD_SUCCESS,
  UPLOAD_ERROR,
  UPLOAD_PROGRESS,
  UPLOAD_STATUS,
  RESET_UPLOAD_STATE
} from "./UploadFileModalTypes";

const initialState = {
  destination: {},
  status: "",
  loaded: 0
};

export default function(state = initialState, action) {
  switch (action.type) {
    case RESET_UPLOAD_STATE:
      return {
        ...state,
        destination: {},
        status: "",
        loaded: 0
      };
    case GET_UPLOAD_DESTINATION:
      return {
        ...state,
        destination: action.payload,
        status: action.status
      };
    case UPLOAD_PROGRESS:
      return {
        ...state,
        loaded: action.loaded
      };
    case UPLOAD_STATUS:
      return {
        ...state,
        status: action.status
      };
    case UPLOAD_SUCCESS:
      return {
        ...state,
        status: action.status
      };

    case UPLOAD_ERROR:
      return {
        ...state,
        status: action.status
      };

    default:
      return state;
  }
}
