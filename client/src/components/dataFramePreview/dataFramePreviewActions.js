import axios from "axios";
import {
  DATAFRAME_PREVIEW_LOADING,
  GET_DATAFRAME_PREVIEW_SUCCESS
  //GET_DATAFRAME_PREVIEW_ERROR
} from "./dataFramePreviewTypes";
import { toast } from "react-toastify";

export const getDataFrameDetails = (
  organizationSlug,
  projectId,
  dataframeId
) => dispatch => {
  axios
    .get(
      `/api/v1/${organizationSlug}/${projectId}/dataframe_details/${dataframeId}`
    )
    .then(response =>
      dispatch({
        type: GET_DATAFRAME_PREVIEW_SUCCESS,
        payload: response.data
      })
    )
    .catch(error => {
      toast.error("Get DataFrame preview problem. " + error, {
        autoClose: 8000,
        hideProgressBar: true,
        newsetOnTop: true
      });
    });
};

export const setDataFramePreviewLoading = () => {
  return {
    type: DATAFRAME_PREVIEW_LOADING
  };
};
