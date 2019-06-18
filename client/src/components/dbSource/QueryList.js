import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { getProjectDetail } from "../../actions/projectDetailActions";
import {
  getDatabaseSourceList,
  getQueryList,
  deleteQuery,
  updateQuery,
  createQuery
} from "./DatabaseSourceActions";
import isEmpty from "../../validation/isEmpty";

import { showModal, hideModal } from "../modals/ModalActions";
import { Button } from "reactstrap";
import ReactTable from "react-table";
import moment from "moment";
import confirm from "reactstrap-confirm";
import TimeAgo from "react-timeago";

class QueryList extends Component {
  componentDidMount() {
    const { organization_slug } = this.props.organization_slug;
    const { project_id } = this.props.project_id;

    const { projectDetail } = this.props.projectDetail;

    if (isEmpty(projectDetail)) {
      this.props.getProjectDetail(organization_slug, project_id);
    }

    this.props.getDatabaseSourceList(organization_slug);
    this.props.getQueryList(organization_slug, project_id);
  }
  componentDidUpdate(prevProps) {}

  async deleteQuery(queryId, queryTitle) {
    let confirmed = await confirm({
      title: "Please confirm",
      message: (
        <p>
          You are going to delete your query: <b>{queryTitle}</b>. All items
          associated with this query will be irreversibly deleted. Please
          confirm.
        </p>
      ),
      confirmText: "Delete"
    });

    if (confirmed) {
      const { organization } = this.props.auth;
      const { projectDetail } = this.props.projectDetail;

      this.props.deleteQuery(organization.slug, projectDetail.id, queryId);
    }
  }

  saveQuery(queryId) {
    const { organization } = this.props.auth;
    const { projectDetail } = this.props.projectDetail;
    const newQuery = { saved: true };
    this.props.updateQuery(
      organization.slug,
      projectDetail.id,
      queryId,
      newQuery
    );
  }

  createQuery() {
    const { queries } = this.props.database;
    const newQuery = {
      name: "Query " + (queries.length + 1)
    };
    const { organization_slug } = this.props.organization_slug;
    const { project_id } = this.props.project_id;
    this.props.createQuery(organization_slug, project_id, newQuery);
  }

  addDatabaseModal() {
    this.props.showModal(
      {
        open: true,
        title: "",
        isEditMode: false,
        closeModal: this.props.hideModal
      },
      "addDatabaseSource"
    );
  }

  render() {
    const { organization_slug } = this.props.organization_slug;
    const { project_id } = this.props.project_id;

    const { databases, queries } = this.props.database;

    let queriesColumns = [
      {
        Header: () => <b>Id</b>,
        accessor: "id",
        width: 44,
        Cell: cellInfo => (
          <div style={{ textAlign: "center" }}>
            <small>{cellInfo.row.id}</small>
          </div>
        )
      },
      {
        Header: () => <b>Name</b>,
        width: 120,
        accessor: "name"
      },
      {
        Header: () => <b>Database</b>,
        width: 120,
        accessor: "parent_database_source_name"
      },
      {
        Header: () => <b>SQL</b>,
        accessor: "query_text"
      },
      {
        Header: () => <b>Status</b>,
        width: 60,
        accessor: "status"
      },
      {
        Header: () => <b>Created by</b>,
        width: 90,
        accessor: "created_by_username"
      },
      {
        Header: () => <b>Saved</b>,
        width: 60,
        accessor: "saved",
        Cell: cellInfo => (cellInfo.row.saved ? "True" : "False")
      },
      {
        Header: () => <b>Created</b>,
        accessor: "created_at",
        width: 110,
        Cell: cellInfo => (
          <small> {<TimeAgo date={cellInfo.row.created_at} />}</small>
        )
      },

      {
        Header: () => <b>Actions</b>,
        accessor: "created_at",
        Cell: cellInfo => (
          <div>
            <Link
              to={
                "/" +
                organization_slug +
                "/project/" +
                project_id +
                "/query_editor/" +
                cellInfo.row.id
              }
            >
              {" "}
              <Button color="success" size="sm">
                <i className="fa fa-pencil-square-o" aria-hidden="true" /> Edit
              </Button>{" "}
            </Link>
            {!cellInfo.row.saved && (
              <Button
                color="primary"
                size="sm"
                onClick={this.saveQuery.bind(this, cellInfo.row.id)}
              >
                <i className="fa fa-save" aria-hidden="true" /> Save
              </Button>
            )}{" "}
            <Button
              color="danger"
              size="sm"
              onClick={this.deleteQuery.bind(
                this,
                cellInfo.row.id,
                cellInfo.row.name
              )}
            >
              <i className="fa fa-trash-o" aria-hidden="true" /> Delete
            </Button>{" "}
          </div>
        )
      }
    ];

    let dbColumns = [
      {
        Header: () => <b>Id</b>,
        accessor: "id",
        width: 44,
        Cell: cellInfo => (
          <div style={{ textAlign: "center" }}>
            <small>{cellInfo.row.id}</small>
          </div>
        )
      },
      {
        Header: () => <b>Database type</b>,
        accessor: "db_type"
      },
      {
        Header: () => <b>Name</b>,
        accessor: "name"
      },
      {
        Header: () => <b>Host</b>,
        accessor: "read_only_settings",
        Cell: cellInfo => cellInfo.row.read_only_settings.host
      },
      {
        Header: () => <b>Port</b>,
        accessor: "read_only_settings",
        Cell: cellInfo => cellInfo.row.read_only_settings.port
      },
      {
        Header: () => <b>Database name</b>,
        accessor: "read_only_settings",
        Cell: cellInfo => cellInfo.row.read_only_settings.database
      },
      {
        Header: () => <b>Created by</b>,
        accessor: "created_by_username"
      },
      {
        Header: () => <b>Added at</b>,
        accessor: "created_at",
        Cell: cellInfo =>
          moment(cellInfo.row.created_at).format("MMMM Do YYYY, h:mm:ss a")
      }
    ];

    return (
      <div className="container-fluid">
        <h3>
          <i className="fa fa-pencil-square-o" aria-hidden="true" /> Queries{" "}
          <Button
            color="success"
            onClick={this.createQuery.bind(this)}
            className="float-right"
          >
            <i className="fa fa-plus" aria-hidden="true" /> New query
          </Button>{" "}
        </h3>
        <hr />
        {isEmpty(queries) && (
          <p>Your query list is empty. Please add your first query.</p>
        )}
        {!isEmpty(queries) && (
          <ReactTable
            data={queries}
            columns={queriesColumns}
            minRows={0}
            defaultPageSize={10}
            showPagination={queries.length > 10}
            className="-highlight -striped"
          />
        )}
        <br />
        <h4>
          <i className="fa fa-database" aria-hidden="true" /> Available database
          sources
          <Button
            className="float-right"
            color="success"
            onClick={this.addDatabaseModal.bind(this)}
          >
            <i className="fa fa-plus" aria-hidden="true" /> New database source
          </Button>
        </h4>
        <hr />
        {isEmpty(databases) && (
          <p>Your database list is empty. Please add your first database.</p>
        )}
        {!isEmpty(databases) && (
          <ReactTable
            data={databases}
            columns={dbColumns}
            minRows={0}
            showPagination={false}
            className="-highlight -striped"
          />
        )}

        <br />
        <Link to={"/" + organization_slug + "/project/" + project_id}>
          <i className="fa fa-long-arrow-left" aria-hidden="true" /> Back
        </Link>
      </div>
    );
  }
}

QueryList.propTypes = {
  projectDetail: PropTypes.object.isRequired,
  getProjectDetail: PropTypes.func.isRequired,

  organization_slug: PropTypes.object.isRequired,
  project_id: PropTypes.object.isRequired,
  database: PropTypes.object.isRequired,
  getDatabaseSourceList: PropTypes.func.isRequired,
  getQueryList: PropTypes.func.isRequired,
  //dataFrameList: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  projectDetail: state.projectDetail,
  organization_slug: ownProps.match.params,
  project_id: ownProps.match.params,
  database: state.database,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {
    getProjectDetail,
    getDatabaseSourceList,
    getQueryList,
    createQuery,
    deleteQuery,
    updateQuery,
    showModal,
    hideModal
  }
)(withRouter(QueryList));
