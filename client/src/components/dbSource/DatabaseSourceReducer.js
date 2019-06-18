import {
  GET_DATABASE_SOURCE_LIST,
  GET_QUERY_LIST,
  GET_QUERY,
  DELETE_QUERY,
  UPDATE_QUERY,
  UPDATE_QUERY_TASK,
  START_EXECUTE
} from "./DatabaseSourceTypes";

const initialState = {
  databases: [],
  queries: [],
  query: {},
  queryResult: {},
  executing: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_DATABASE_SOURCE_LIST:
      return {
        ...state,
        databases: action.payload
      };
    case GET_QUERY:
      return {
        ...state,
        query: action.payload,
        queryResult: action.payload.hasOwnProperty("result_preview_data")
          ? action.payload.result_preview_data
          : {}
      };
    case GET_QUERY_LIST:
      return {
        ...state,
        queries: action.payload
      };
    case DELETE_QUERY:
      return {
        ...state,
        queries: state.queries.filter(
          (item, index) => item.id !== action.queryId
        )
      };
    case UPDATE_QUERY:
      let updatedQueries = state.queries.map(item => {
        if (item.id === action.updatedQuery.id) {
          return { ...item, ...action.updatedQuery };
        }
        return item;
      });
      let updatedQuery =
        state.query.id === action.updatedQuery.id
          ? action.updatedQuery
          : state.query;
      return {
        ...state,
        queries: updatedQueries,
        query: updatedQuery
      };
    case START_EXECUTE:
      return {
        ...state,
        executing: true
      };
    case UPDATE_QUERY_TASK:
      let updatedQueries2 = state.queries.map(item => {
        if (item.id === action.db_id) {
          return { ...item, status: action.status };
        }
        return item;
      });
      let updatedQuery2 = state.query;
      let newResult = state.queryResult;
      if (state.query.id === action.db_id) {
        updatedQuery2 = { ...state.query, status: action.status };
        if (action.hasOwnProperty("result")) {
          newResult = action.result;
        }
      }
      return {
        ...state,
        executing: action.status !== "done" && action.status !== "error",
        queries: updatedQueries2,
        query: updatedQuery2,
        queryResult: newResult
      };

    default:
      return state;
  }
}
