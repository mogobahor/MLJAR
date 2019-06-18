import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import moment from "moment";
import { getDataSources } from "../../actions/datasourcesActions.js";
import DataFrameDetails from "../dataFrameDetails/DataFrameDetails";

class DataSources extends Component {
  componentDidMount() {
    const { slug } = this.props.auth.organization;
    const project_id = this.props.project_id.project_id;

    this.props.getDataSources(slug, project_id);
  }
  componentDidUpdate(prevProps) {}

  render() {
    const { organization_slug } = this.props.organization_slug;
    const { datasources, loading } = this.props.datasources;
    let items;

    if (items === null || loading) {
      items = <div>Loading data sources ...</div>;
    } else {
      if (datasources.length > 0) {
        items = datasources.map(datasource => {
          return (
            <div className="border-bottom" key={datasource.id}>
              <div className="row mb-3 mt-3">
                <div className="col-9">
                  <DataFrameDetails data={datasource} {...this.props} />
                  <h5>Data source: {datasource.title}</h5>
                  <b>File name:</b> {datasource.file_name} <br />
                  <b>File size:</b> {datasource.file_size} MB <br />
                  <b>Path:</b> {datasource.absolute_path} <br />
                  <b>Created at:</b>{" "}
                  {moment(datasource.created_at).format(
                    "MMMM Do YYYY, h:mm:ss a"
                  )}
                  <br />
                  <b>Added by:</b> {datasource.created_by_username}
                  <br />
                  <b>Description:</b> {datasource.description}
                  <br />
                  <small>(Id: {datasource.id})</small>
                  <br />
                </div>
              </div>
            </div>
          );
        });
      } else {
        items = <div>Data sources list is empty</div>;
      }
    }

    return (
      <div className="container">
        <div className="row">
          <div className="col-10">
            <h1>Data sources</h1>
          </div>

          <div className="col-2">
            <Link
              to="/datasources/add/"
              className="btn btn-primary mt-2 btn-block"
            >
              ee Add data source
            </Link>
          </div>
        </div>
        <hr />
        {items}

        <Link
          to={
            "/" +
            organization_slug +
            "/project/" +
            this.props.project_id.project_id
          }
        >
          {"<<"} Back
        </Link>
      </div>
    );
  }
}

DataSources.propTypes = {
  project_id: PropTypes.object.isRequired,
  organization_slug: PropTypes.object.isRequired,
  getDataSources: PropTypes.func.isRequired,
  datasources: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  project_id: ownProps.match.params,
  organization_slug: ownProps.match.params,
  datasources: state.datasources,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getDataSources }
)(withRouter(DataSources));
