import axios from "axios";
import { GET_PREDICTIONS_SUCCESS } from "./PredictionTypes";
import { toast } from "react-toastify";

export const getPredictions = (organization_slug, project_id) => dispatch => {
  axios
    .get(`/api/v1/${organization_slug}/${project_id}/ml_batch_predictions`)
    .then(response =>
      dispatch({
        type: GET_PREDICTIONS_SUCCESS,
        payload: response.data
      })
    )
    .catch(error => {
      toast.error("Get ML predictions problem. " + error, {
        autoClose: 8000,
        hideProgressBar: true,
        newsetOnTop: true
      });
    });
};
