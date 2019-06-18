import axios from "axios";
import {
  GET_UPLOAD_DESTINATION,
  UPLOAD_SUCCESS,
  UPLOAD_ERROR,
  // UPLOAD_STATUS,
  UPLOAD_PROGRESS,
  RESET_UPLOAD_STATE
} from "./UploadFileModalTypes";

import { ADD_UPLOADED_FILE } from "../../fileUploadList/FileUploadListTypes";

export const getUploadDestination = (
  organization_slug,
  project_id,
  form_input_file,
  newFileDataSource,
  closeModal
) => dispatch => {
  axios
    .get(
      `/api/v1/${organization_slug}/${project_id}/${
        form_input_file.name
      }/upload_destination`
    )
    .then(res => {
      const { relative_dir, absolute_path, filename } = res.data;
      console.log(relative_dir, absolute_path, filename, res.data);

      dispatch({
        type: GET_UPLOAD_DESTINATION,
        payload: res.data,
        status: "Upload destination is resolved"
      });

      const data = form_input_file; //new FormData();
      //data.append("file", form_input_file); //, form_input_file.name);
      console.log(data);
      newFileDataSource["absolute_path"] = absolute_path;
      newFileDataSource["file_size"] = Math.round(
        form_input_file.size / 1024 / 1024,
        4
      ); // in MB
      dispatch(
        upload(
          organization_slug,
          project_id,
          relative_dir,
          filename,
          data,
          newFileDataSource,
          closeModal
        )
      );
    })
    .catch(err =>
      dispatch({
        type: GET_UPLOAD_DESTINATION,
        payload: {},
        status: "Problem with resolving upload destionation"
      })
    );
};

export const upload = (
  organization_slug,
  project_id,
  relative_dir,
  file_name,
  data,
  newFileDataSource,
  closeModal
) => dispatch => {
  axios
    .put(
      `/api/v1/${organization_slug}/${relative_dir}/${file_name}/upload`,
      data,
      {
        onUploadProgress: ProgressEvent => {
          dispatch({
            type: UPLOAD_PROGRESS,
            loaded: (ProgressEvent.loaded / ProgressEvent.total) * 100
          });
        }
      }
    )
    .then(res => {
      dispatch({
        type: UPLOAD_SUCCESS,
        status: "Upload success"
      });
      dispatch(
        addFileDataSource(
          organization_slug,
          project_id,
          newFileDataSource,
          closeModal
        )
      );
    })
    .catch(err =>
      dispatch({
        type: UPLOAD_ERROR,
        status: "Upload problems"
      })
    );
};

export const addFileDataSource = (
  organization_slug,
  project_id,
  newFileDataSource,
  closeModal
) => dispatch => {
  axios
    .post(
      `/api/v1/${organization_slug}/${project_id}/file_sources`,
      newFileDataSource
    )
    .then(res => {
      closeModal();
      dispatch({
        type: RESET_UPLOAD_STATE
      });
      dispatch({
        type: ADD_UPLOADED_FILE,
        newFile: res.data
      });
    })
    .catch(error => {
      // Error
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        let error_status = "";
        //error.response.data.map((field, err_msg) => {
        //
        //});
        for (let [field, msg] of Object.entries(error.response.data)) {
          console.log(field, msg);
          error_status += " ERROR: " + field + ": " + msg;
        }
        dispatch({
          type: UPLOAD_ERROR,
          status: "Upload file problem. " + error_status
        });
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
      }
      console.log(error.config);
    });
};
