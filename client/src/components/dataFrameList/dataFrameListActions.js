import axios from "axios";
import {
  DATAFRAMES_LOADING,
  GET_DATAFRAMES_SUCCESS,
  GET_DATAFRAMES_ERROR
} from "./dataFrameListTypes";

// Get all data frames
export const getDataFrames = (organization_slug, project_id) => dispatch => {
  dispatch(setDataFramesLoading());
  axios
    .get(`/api/v1/${organization_slug}/${project_id}/dataframes`)
    .then(response =>
      dispatch({
        type: GET_DATAFRAMES_SUCCESS,
        payload: response.data
      })
    )
    .catch(error => {
      let error_message = "Error while fetching DataFrames. ";

      if (error.response) {
        error_message += error.response.data;
      }
      dispatch({
        type: GET_DATAFRAMES_ERROR,
        error_message: error_message
      });
    });
};

// Projects loading
export const setDataFramesLoading = () => {
  return {
    type: DATAFRAMES_LOADING
  };
};
