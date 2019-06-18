import { GET_MLMODELS_SUCCESS } from "./MLModelTypes";

const initialState = {
  mlmodels: []
};

export function mlmodelReducer(state = initialState, action) {
  switch (action.type) {
    case GET_MLMODELS_SUCCESS:
      return {
        ...state,
        mlmodels: action.payload
      };

    default:
      return state;
  }
}
