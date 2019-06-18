import {
  RESET_DATAFRAME_COLUMNS,
  GET_DATAFRAME_COLUMNS_SUCCESS,
  GET_DATAFRAME_COLUMNS_ERROR,
  SET_COLUMN_USAGE
} from "./ColumnsSelectionModalTypes";

const initialState = {
  columns: [],

  targetColumns: null,
  inputColumns: null,
  doNotUseColumns: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case RESET_DATAFRAME_COLUMNS:
      return {
        ...state,
        columns: []
      };
    case GET_DATAFRAME_COLUMNS_SUCCESS:
      const { columns_details } = action.payload;

      let allColumns = columns_details.map((col, index) => {
        return {
          label: col.name,
          value: col.name,
          destination: "input",
          column_details: col,
          index: index
        };
      });

      return {
        ...state,
        columns: allColumns,
        targetColumn: null,
        inputColumns: allColumns,
        doNotUseColumns: null
      };
    case SET_COLUMN_USAGE:
      const { index, newUsage } = action;
      state.columns[index].destination = newUsage;

      return {
        ...state,
        columns: state.columns,
        targetColumn: state.columns.filter(col => col.destination === "target"),
        inputColumns: state.columns.filter(col => col.destination === "input"),
        doNotUseColumns: state.columns.filter(
          col => col.destination === "doNotUse"
        )
      };
    case GET_DATAFRAME_COLUMNS_ERROR:
      return {
        ...state,
        columns: []
      };
    default:
      return state;
  }
}
