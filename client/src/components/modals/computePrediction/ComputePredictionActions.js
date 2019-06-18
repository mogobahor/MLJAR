import axios from "axios";
import { COMPUTE_PREDICTION } from "../../prediction/PredictionTypes";

import { toast } from "react-toastify";

export const computePrediction = (
  organization_slug,
  project_id,
  predictionSettings,
  closeModal
) => dispatch => {
  axios
    .post(
      `/api/v1/${organization_slug}/${project_id}/ml_batch_predictions`,
      predictionSettings
    )
    .then(response => {
      closeModal();
      dispatch({
        type: COMPUTE_PREDICTION,
        payload: response.data
      });
    })
    .catch(error => {
      toast.error(
        "Compute ML prediction problem. " +
          error +
          JSON.stringify(error.response.data),
        {
          autoClose: 8000,
          hideProgressBar: true,
          newsetOnTop: true
        }
      );
    });
};
