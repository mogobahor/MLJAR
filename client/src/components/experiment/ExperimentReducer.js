import {
  EXPERIMENTS_LOADING,
  GET_EXPERIMENTS_SUCCESS,
  GET_EXPERIMENT_SUCCESS,
  GET_EXPERIMENTS_ERROR,
  DELETE_EXPERIMENT,
  ADD_EXPERIMENT
} from "./ExperimentTypes";

const initialState = {
  experiments: [],
  selected_experiment: null,
  loading: false,
  error_message: ""
};

export function experimentReducer(state = initialState, action) {
  switch (action.type) {
    case EXPERIMENTS_LOADING:
      return {
        ...state,
        experiments: [],
        selected_experiment: null,
        loading: true,
        error_message: ""
      };
    case GET_EXPERIMENTS_SUCCESS:
      return {
        ...state,
        experiments: action.payload,
        loading: false,
        error_message: ""
      };
    case GET_EXPERIMENT_SUCCESS:
      return {
        ...state,
        selected_experiment: action.payload,
        loading: false,
        error_message: ""
      };
    case GET_EXPERIMENTS_ERROR:
      return {
        ...state,
        experiments: [],
        loading: false,
        error_message: action.error_message
      };
    case DELETE_EXPERIMENT:
      return {
        ...state,
        experiments: state.experiments.filter(
          (item, index) => item.id !== action.experimentId
        ),
        loading: false
      };
    case ADD_EXPERIMENT:
      return {
        ...state,
        experiments: [...state.experiments, action.newExperiment],
        loading: false
      };
    default:
      return state;
  }
}
