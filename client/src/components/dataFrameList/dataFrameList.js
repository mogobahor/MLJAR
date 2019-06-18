import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { getDataFrames } from "./dataFrameListActions";
import moment from "moment";
import isEmpty from "../../validation/isEmpty";
import { getProjectDetail } from "../../actions/projectDetailActions";
import { Button } from "reactstrap";

class DataFrameList extends Component {
  componentDidMount() {
    const { organization_slug } = this.props.organization_slug;
    const { project_id } = this.props.project_id;

    const { projectDetail } = this.props.projectDetail;
    if (isEmpty(projectDetail)) {
      this.props.getProjectDetail(organization_slug, project_id);
    }

    this.props.getDataFrames(organization_slug, project_id);
  }
  componentDidUpdate(prevProps) {}

  render() {
    const { organization_slug } = this.props.organization_slug;
    const { project_id } = this.props.project_id;
    const { dataframes, loading } = this.props.dataFrameList;
    let items;

    console.log(dataframes);
    if (loading) {
      items = <div>Loading DataFrames ...</div>;
    } else {
      if (dataframes.length > 0) {
        items = dataframes.map(details => {
          console.log(details);
          return (
            <div className="col-6 mt-2" key={"df_" + details.id}>
              <div className="projectdiv">
                <b className="projectTitle">
                  <i className="fa fa-th" aria-hidden="true" /> {details.name}
                </b>
                <br />
                {details.source_file && (
                  <b>DataFrame from data uploaded by user</b>
                )}
                {details.source_query && <b>DataFrame from query</b>}
                <br />
                <b>File size:</b> {details.file_size} MB <br />
                <b>Path:</b> {details.absolute_path} <br />
                <b>Created at:</b>{" "}
                {moment(details.created_at).format("MMMM Do YYYY, h:mm:ss a")}
                <br />
                <b>Added by:</b> {details.created_by_username}
                <br />
                <small>(Id: {details.id})</small>
                <br />
                <Link
                  to={
                    "/" +
                    organization_slug +
                    "/project/" +
                    project_id +
                    "/dataframe_preview/" +
                    details.id
                  }
                  className="btn btn-primary btn-md float-right"
                >
                  <b>
                    Data preview{" "}
                    <i className="fa fa-arrow-right" aria-hidden="true" />
                  </b>
                </Link>{" "}
                <br />
                <br />
              </div>
            </div>
          );
        });
      } else {
        items = <div>DataFrames list is empty</div>;
      }
    }

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-10">
            <h3>
              <i className="fa fa-th" aria-hidden="true" /> DataFrames
            </h3>
          </div>
        </div>
        <hr />

        <div className="container-fluid">
          <div className="row  mb-3 mt-3">{items}</div>
        </div>
        <Link to={"/" + organization_slug + "/project/" + project_id}>
          <i className="fa fa-long-arrow-left" aria-hidden="true" /> Back
        </Link>
      </div>
    );
  }
}

DataFrameList.propTypes = {
  projectDetail: PropTypes.object.isRequired,
  getProjectDetail: PropTypes.func.isRequired,
  getDataFrames: PropTypes.func.isRequired,
  organization_slug: PropTypes.object.isRequired,
  project_id: PropTypes.object.isRequired,
  dataFrameList: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  projectDetail: state.projectDetail,
  organization_slug: ownProps.match.params,
  project_id: ownProps.match.params,
  dataFrameList: state.dataFrameList,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getDataFrames, getProjectDetail }
)(withRouter(DataFrameList));
