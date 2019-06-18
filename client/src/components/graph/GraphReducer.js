import { NODE_SELECTED } from "./GraphTypes";

const initialState = {
  selected_node: null
};

export function graphReducer(state = initialState, action) {
  switch (action.type) {
    case NODE_SELECTED:
      return {
        ...state,
        selected_node: action.node
      };
    default:
      return state;
  }
}
