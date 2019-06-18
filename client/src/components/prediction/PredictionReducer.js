import { GET_PREDICTIONS_SUCCESS, COMPUTE_PREDICTION } from "./PredictionTypes";

const initialState = {
  predictions: []
};

export function predictionReducer(state = initialState, action) {
  switch (action.type) {
    case GET_PREDICTIONS_SUCCESS:
      return {
        ...state,
        predictions: action.payload
      };
    case COMPUTE_PREDICTION:
      return {
        ...state,
        predictions: [...state.predictions, action.payload]
      };
    default:
      return state;
  }
}
