import { NODE_SELECTED } from "./GraphTypes";

export const selectNode = node => dispatch => {
  dispatch({
    type: NODE_SELECTED,
    node: node
  });
};
