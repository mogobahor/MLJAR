import axios from "axios";
import { GET_MLMODELS_SUCCESS } from "./MLModelTypes";
import { toast } from "react-toastify";

export const getMLModels = (organization_slug, project_id) => dispatch => {
  axios
    .get(`/api/v1/${organization_slug}/${project_id}/ml_models`)
    .then(response => {
      console.log("response");
      console.log(response.data);
      dispatch({
        type: GET_MLMODELS_SUCCESS,
        payload: response.data
      });
    })
    .catch(error => {
      toast.error("Get ML models problem. " + error, {
        autoClose: 8000,
        hideProgressBar: true,
        newsetOnTop: true
      });
    });
};
