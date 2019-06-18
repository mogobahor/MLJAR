import axios from "axios";
import {
  EXPERIMENTS_LOADING,
  GET_EXPERIMENTS_SUCCESS,
  GET_EXPERIMENTS_ERROR,
  GET_EXPERIMENT_SUCCESS,
  DELETE_EXPERIMENT,
  UPDATE_EXPERIMENT
} from "./ExperimentTypes";
import { toast } from "react-toastify";

export const getExperiments = (organization_slug, project_id) => dispatch => {
  dispatch(setExperimentsLoading());
  axios
    .get(`/api/v1/${organization_slug}/${project_id}/ml_experiments`)
    .then(response =>
      dispatch({
        type: GET_EXPERIMENTS_SUCCESS,
        payload: response.data
      })
    )
    .catch(error => {
      let error_message = "Error while fetching ML Experiments. ";

      if (error.response) {
        error_message += error.response.data;
      }
      dispatch({
        type: GET_EXPERIMENTS_ERROR,
        error_message: error_message
      });
    });
};

export const setExperimentsLoading = () => {
  return {
    type: EXPERIMENTS_LOADING
  };
};

export const getExperiment = (
  organizationSlug,
  projectId,
  experimentId
) => dispatch => {
  dispatch(setExperimentsLoading());
  axios
    .get(
      `/api/v1/${organizationSlug}/${projectId}/ml_experiments/${experimentId}`
    )
    .then(response =>
      dispatch({
        type: GET_EXPERIMENT_SUCCESS,
        payload: response.data
      })
    )
    .catch(error => {
      toast.error("Get ML Experiment problem. " + error, {
        autoClose: 8000,
        hideProgressBar: true,
        newsetOnTop: true
      });
    });
};

export const deleteExperiment = (
  organizationSlug,
  projectId,
  experimentId
) => dispatch => {
  axios
    .delete(
      `/api/v1/${organizationSlug}/${projectId}/ml_experiments/${experimentId}`
    )
    .then(res => {
      dispatch({
        type: DELETE_EXPERIMENT,
        experimentId: experimentId
      });
    })
    .catch(err => {
      toast.error("Delete ML Experiment problem. " + err, {
        autoClose: 8000,
        hideProgressBar: true,
        newsetOnTop: true
      });
    });
};

export const updateExperiment = (
  organizationSlug,
  projectId,
  experimentId,
  experimentData
) => dispatch => {
  axios
    .patch(
      `/api/v1/${organizationSlug}/${projectId}/ml_experiments/${experimentId}`,
      experimentData
    )
    .then(res => {
      dispatch({ type: UPDATE_EXPERIMENT, updatedExperiment: res.data });
    })
    .catch(err => {
      toast.error("Update ML Experiment problem. " + err, {
        autoClose: 8000,
        hideProgressBar: true,
        newsetOnTop: true
      });
    });
};
