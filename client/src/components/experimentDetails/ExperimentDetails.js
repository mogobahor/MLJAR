import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
//import PropTypes from "prop-types";

//import { getExperiments } from "./experimentListActions";
//import { getProjectDetail } from "../../actions/projectDetailActions";
//import moment from "moment";
//import isEmpty from "../../validation/isEmpty";

class ExperimentDetails extends Component {
  componentDidMount() {
    //const { organization_slug } = this.props.organization_slug;
    //const { project_id } = this.props.project_id;
    //const { projectDetail } = this.props.projectDetail;
    //if (isEmpty(projectDetail)) {
    //  this.props.getProjectDetail(organization_slug, project_id);
    //}
    //this.props.getExperiments(organization_slug, project_id);
  }

  componentDidUpdate(prevProps) {}

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-10">
            <h3>Machine Learning Experiments</h3>
          </div>
        </div>
      </div>
    );
  }
}

ExperimentDetails.propTypes = {};

const mapStateToProps = (state, ownProps) => ({});

export default connect(
  mapStateToProps,
  {}
)(withRouter(ExperimentDetails));
