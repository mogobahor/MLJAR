import axios from "axios";
import { DATA_SOURCES_LOADING, GET_DATA_SOURCES } from "./types";
//import { push } from "connected-react-router";

export const getDataSources = (organization_slug, project_id) => dispatch => {
  console.log("get data sources");
  dispatch(setDataSourcesLoading());
  axios
    .get(`/api/v1/${organization_slug}/${project_id}/file_sources`)
    .then(res =>
      dispatch({
        type: GET_DATA_SOURCES,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_DATA_SOURCES,
        payload: {}
      })
    );
};

// Data Sources loading
export const setDataSourcesLoading = () => {
  return {
    type: DATA_SOURCES_LOADING
  };
};
