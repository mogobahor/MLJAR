import axios from "axios";
import { ADD_DATABASE_SOURCE } from "../../dbSource/DatabaseSourceTypes";

import { toast } from "react-toastify";

export const addDatabaseSource = (
  organization_slug,
  dbSettings,
  closeModal
) => dispatch => {
  axios
    .post(`/api/v1/${organization_slug}/database_source`, dbSettings)
    .then(response => {
      closeModal();

      dispatch({
        type: ADD_DATABASE_SOURCE,
        payload: response.data
      });
    })
    .catch(error => {
      let errMsg = error + JSON.stringify(error.response.data);
      if (error.response.data.hasOwnProperty("non_field_errors")) {
        errMsg = error.response.data["non_field_errors"][0];
      }
      toast.error("Add database source problem: " + errMsg, {
        autoClose: 8000,
        hideProgressBar: true,
        newsetOnTop: true
      });
    });
};
