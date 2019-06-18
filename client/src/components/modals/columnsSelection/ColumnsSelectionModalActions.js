import axios from "axios";
import {
  GET_DATAFRAME_COLUMNS_SUCCESS,
  GET_DATAFRAME_COLUMNS_ERROR,
  SET_COLUMN_USAGE
} from "./ColumnsSelectionModalTypes";
import { toast } from "react-toastify";

export const getDataFrameColumns = (
  organizationSlug,
  projectId,
  dataframeId
) => dispatch => {
  axios
    .get(
      `/api/v1/${organizationSlug}/${projectId}/dataframe_columns/${dataframeId}`
    )
    .then(response =>
      dispatch({
        type: GET_DATAFRAME_COLUMNS_SUCCESS,
        payload: response.data
      })
    )
    .catch(error => {
      dispatch({
        type: GET_DATAFRAME_COLUMNS_ERROR
      });
      toast.error("Get DataFrame columns problem. " + error, {
        autoClose: 8000,
        hideProgressBar: true,
        newsetOnTop: true
      });
    });
};

export const setColumnUsage = (index, newUsage) => dispatch => {
  dispatch({
    type: SET_COLUMN_USAGE,
    index: index,
    newUsage: newUsage
  });
};
