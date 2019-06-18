import axios from "axios";
import {
  GET_COLUMNS_USAGE_SUCCESS,
  GET_COLUMNS_USAGE_LIST_SUCCESS,
  DELETE_COLUMNS_USAGE,
  ADD_COLUMNS_USAGE
} from "./ColumnsUsageTypes";
import { toast } from "react-toastify";

export const getColumnsUsage = (
  organizationSlug,
  projectId,
  usageId
) => dispatch => {
  axios
    .get(`/api/v1/${organizationSlug}/${projectId}/ml_columns_usage/${usageId}`)
    .then(response =>
      dispatch({
        type: GET_COLUMNS_USAGE_SUCCESS,
        payload: response.data
      })
    )
    .catch(error => {
      toast.error("Get columns usage problem. " + error, {
        autoClose: 8000,
        hideProgressBar: true,
        newsetOnTop: true
      });
    });
};

export const getColumnsUsageList = (
  organizationSlug,
  projectId
) => dispatch => {
  axios
    .get(`/api/v1/${organizationSlug}/${projectId}/ml_columns_usage`)
    .then(response =>
      dispatch({
        type: GET_COLUMNS_USAGE_LIST_SUCCESS,
        payload: response.data
      })
    )
    .catch(error => {
      toast.error("Get columns usage list problem. " + error, {
        autoClose: 8000,
        hideProgressBar: true,
        newsetOnTop: true
      });
    });
};

export const deleteColumnsUsage = (
  organizationSlug,
  projectId,
  usageId
) => dispatch => {
  axios
    .delete(
      `/api/v1/${organizationSlug}/${projectId}/ml_columns_usage/${usageId}`
    )
    .then(res => {
      dispatch({
        type: DELETE_COLUMNS_USAGE,
        usageId: usageId
      });
    })
    .catch(err => {
      toast.error("Delete columns usage problem. " + err, {
        autoClose: 8000,
        hideProgressBar: true,
        newsetOnTop: true
      });
    });
};

export const addColumnsUsage = (
  organizationSlug,
  projectId,
  newColumnsUsageData,
  closeModal
) => dispatch => {
  console.log("addColumnsUsage", organizationSlug, projectId);
  axios
    .post(
      `/api/v1/${organizationSlug}/${projectId}/ml_columns_usage`,
      newColumnsUsageData
    )
    .then(response => {
      console.log("addColumnsUsage success");
      console.log(response);
      closeModal();

      dispatch({
        type: GET_COLUMNS_USAGE_SUCCESS,
        payload: response.data
      });
      dispatch({
        type: ADD_COLUMNS_USAGE,
        payload: response.data
      });
    })
    .catch(error => {
      toast.error("Add columns usage problem. " + error, {
        autoClose: 8000,
        hideProgressBar: true,
        newsetOnTop: true
      });
    });
};
