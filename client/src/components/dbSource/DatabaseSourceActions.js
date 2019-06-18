import axios from "axios";
import { push } from "connected-react-router";
import {
  GET_DATABASE_SOURCE_LIST,
  CREATE_QUERY,
  GET_QUERY_LIST,
  GET_QUERY,
  DELETE_QUERY,
  UPDATE_QUERY,
  START_EXECUTE
} from "./DatabaseSourceTypes";

import { toast } from "react-toastify";

export const getQueryList = (organization_slug, projectId) => dispatch => {
  axios
    .get(`/api/v1/${organization_slug}/${projectId}/query`)
    .then(response =>
      dispatch({
        type: GET_QUERY_LIST,
        payload: response.data
      })
    )
    .catch(error => {
      toast.error("Get query list problem. " + error, {
        autoClose: 8000,
        hideProgressBar: true,
        newsetOnTop: true
      });
    });
};

export const getQuery = (organization_slug, projectId, queryId) => dispatch => {
  axios
    .get(`/api/v1/${organization_slug}/${projectId}/query/${queryId}`)
    .then(response => {
      dispatch({
        type: GET_QUERY,
        payload: response.data
      });
    })
    .catch(error => {
      toast.error("Get query problem. " + error, {
        autoClose: 8000,
        hideProgressBar: true,
        newsetOnTop: true
      });
    });
};

export const getDatabaseSourceList = organization_slug => dispatch => {
  axios
    .get(`/api/v1/${organization_slug}/database_source`)
    .then(response =>
      dispatch({
        type: GET_DATABASE_SOURCE_LIST,
        payload: response.data
      })
    )
    .catch(error => {
      toast.error("Get database source problem. " + error, {
        autoClose: 8000,
        hideProgressBar: true,
        newsetOnTop: true
      });
    });
};

export const createQuery = (
  organization_slug,
  projectId,
  newQuery
) => dispatch => {
  axios
    .post(`/api/v1/${organization_slug}/${projectId}/query`, newQuery)
    .then(response => {
      dispatch({
        type: CREATE_QUERY,
        payload: response.data
      });
      const redirectTo = `/${organization_slug}/project/${projectId}/query_editor/${
        response.data.id
      }`;
      dispatch(push(redirectTo));
    })
    .catch(error => {
      toast.error("Create new query problem. " + error, {
        autoClose: 8000,
        hideProgressBar: true,
        newsetOnTop: true
      });
    });
};

export const deleteQuery = (
  organizationSlug,
  projectId,
  queryId
) => dispatch => {
  axios
    .delete(`/api/v1/${organizationSlug}/${projectId}/query/${queryId}`)
    .then(res => {
      dispatch({
        type: DELETE_QUERY,
        queryId: queryId
      });
    })
    .catch(err => {
      toast.error("Delete query problem. " + err, {
        autoClose: 8000,
        hideProgressBar: true,
        newsetOnTop: true
      });
    });
};

export const updateQuery = (
  organizationSlug,
  projectId,
  queryId,
  queryData
) => dispatch => {
  axios
    .patch(
      `/api/v1/${organizationSlug}/${projectId}/query/${queryId}`,
      queryData
    )
    .then(res => {
      dispatch({ type: UPDATE_QUERY, updatedQuery: res.data });
    })
    .catch(err => {
      toast.error("Update query problem. " + err, {
        autoClose: 8000,
        hideProgressBar: true,
        newsetOnTop: true
      });
    });
};

export const executeQuery = (
  organization_slug,
  projectId,
  queryId,
  queryData
) => dispatch => {
  dispatch({
    type: START_EXECUTE
  });
  axios
    .post(
      `/api/v1/${organization_slug}/${projectId}/execute_query/${queryId}`,
      queryData
    )
    .then(response => {
      console.log("rd");
      console.log(response.data);

      dispatch({
        type: GET_QUERY,
        payload: response.data
      });
    })
    .catch(error => {
      toast.error(
        "Execute query problem. " + error + JSON.stringify(error.response.data),
        {
          autoClose: 8000,
          hideProgressBar: true,
          newsetOnTop: true
        }
      );
    });
};
