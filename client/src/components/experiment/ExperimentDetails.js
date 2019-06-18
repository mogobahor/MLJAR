import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import moment from "moment";

import { Button, UncontrolledTooltip } from "reactstrap";
import confirm from "reactstrap-confirm";

import { deleteExperiment } from "./ExperimentActions";

class ExperimentDetails extends Component {
  componentDidMount() {}
  componentDidUpdate(prevProps) {}

  async deleteExperiment(experimentId, experimentTitle) {
    let confirmed = await confirm({
      title: "Please confirm",
      message: (
        <p>
          You are going to delete your experiment: <b>{experimentTitle}</b>. All
          items associated with this experiment will be irreversibly deleted.
          Please confirm.
        </p>
      ),
      confirmText: "Delete"
    });

    if (confirmed) {
      const { organization } = this.props.auth;
      const { projectDetail } = this.props.projectDetail;
      console.log("delete confirmed", organization, projectDetail.id);
      this.props.deleteExperiment(
        organization.slug,
        projectDetail.id,
        experimentId
      );
    }
  }

  render() {
    const { details } = this.props;
    return (
      <div className="border-bottom">
        <div className="row mb-3 mt-3">
          <div className="col-12">
            <h4>
              {" "}
              <i className="fa fa-flask" aria-hidden="true" /> {details.title}{" "}
              <UncontrolledTooltip
                placement="top"
                target={"deleteFileBtn" + details.id}
              >
                Delete this experiment
              </UncontrolledTooltip>
              <Button
                id={"deleteFileBtn" + details.id}
                color="link"
                className="projectSmallButtons"
                onClick={this.deleteExperiment.bind(
                  this,
                  details.id,
                  details.title
                )}
              >
                <i className="fa fa-times" aria-hidden="true" />
              </Button>
            </h4>
            <b>Status:</b> {details.status} <br />
            <b>Training:</b> {details.parent_training_dataframe} <br />
            <b>Models count:</b> {details.models_cnt} <br />
            <b>Created at:</b>{" "}
            {moment(details.created_at).format("MMMM Do YYYY, h:mm:ss a")}
            <br />
            <b>Added by:</b> {details.created_by_username}
            <br />
            <b>Description:</b> {details.description}
            <br />
            <pre>{JSON.stringify(details.params, undefined, 4)}</pre>
            <br />
            <small>(Id: {details.id})</small>
            <br />
          </div>
        </div>
      </div>
    );
  }
}

ExperimentDetails.propTypes = {
  deleteExperiment: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => ({});

export default connect(
  mapStateToProps,
  { deleteExperiment }
)(withRouter(ExperimentDetails));
