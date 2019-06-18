import axios from "axios";
import { ADD_EXPERIMENT } from "../../experiment/ExperimentTypes";

import { toast } from "react-toastify";

export const createExperiment = (
  organization_slug,
  project_id,
  newExperiment,
  closeModal
) => dispatch => {
  axios
    .post(
      `/api/v1/${organization_slug}/${project_id}/ml_experiments`,
      newExperiment
    )
    .then(response => {
      closeModal();
      dispatch({
        type: ADD_EXPERIMENT,
        newExperiment: response.data
      });
    })
    .catch(error => {
      toast.error("Create ML Experiment problem. " + error, {
        autoClose: 8000,
        hideProgressBar: true,
        newsetOnTop: true
      });
    });
};
