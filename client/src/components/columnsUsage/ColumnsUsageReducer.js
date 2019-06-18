import {
  GET_COLUMNS_USAGE_SUCCESS,
  GET_COLUMNS_USAGE_LIST_SUCCESS,
  DELETE_COLUMNS_USAGE,
  ADD_COLUMNS_USAGE
} from "./ColumnsUsageTypes";

const initialState = {
  columnsUsage: null,
  columnsUsageList: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_COLUMNS_USAGE_SUCCESS:
      return {
        ...state,
        columnsUsage: action.payload
      };

    case GET_COLUMNS_USAGE_LIST_SUCCESS:
      return {
        ...state,
        columnsUsageList: action.payload
      };
    case DELETE_COLUMNS_USAGE:
      return {
        ...state,
        columnsUsage: null,
        columnsUsageList: state.columnsUsageList.filter(
          (item, index) => item.id !== action.usageId
        )
      };
    case ADD_COLUMNS_USAGE:
      return {
        ...state,
        columnsUsageList: [...state.columnsUsageList, action.payload]
      };

    default:
      return state;
  }
}
