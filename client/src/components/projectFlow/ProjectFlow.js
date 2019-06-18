import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import isEmpty from "../../validation/isEmpty";
//import moment from "moment";
import { getProjectDetail } from "../../actions/projectDetailActions";
import Graph from "../graph/Graph";
//import ProjectTabs from "./ProjectTabs";
import SplitPane from "react-split-pane";
//import DataFrameDetails from "../dataFrameDetails/DataFrameDetails";
//import ExperimentDetails from "../experimentDetails/ExperimentDetails";

import {
  UPLOADED_FILE_TYPE,
  COLUMNS_SELECTION_TYPE,
  MLEXPERIMENT_TYPE
} from "../graph/GraphConfig";

import FileUploadDetails from "../fileUploadList/FileUploadDetails";
import DataFramePreview from "../dataFramePreview/dataFramePreview";
import ColumnsUsageDetails from "../columnsUsage/ColumnsUsageDetails";
import ExperimentDetails from "../experiment/ExperimentDetails";
import MLModelList from "../mlmodel/MLModelList";

class ProjectFlow extends Component {
  componentDidMount() {
    const { organization_slug } = this.props.organization_slug;
    const { project_id } = this.props.project_id;
    const { projectDetail } = this.props.projectDetail;

    if (isEmpty(projectDetail)) {
      this.props.getProjectDetail(organization_slug, project_id);
    }
  }

  render() {
    let containerHeight = window.innerHeight - 90;

    let rightPane = <p>Please select a node.</p>;
    const { selected_node } = this.props.graph;
    if (!isEmpty(selected_node)) {
      rightPane = (
        <div>
          {selected_node.type} {selected_node.db_id}
        </div>
      );

      if (selected_node.type === UPLOADED_FILE_TYPE) {
        const { selected_file } = this.props.fileUploadList;
        if (!isEmpty(selected_file)) {
          rightPane = (
            <div>
              <FileUploadDetails
                details={selected_file}
                {...this.props}
                key={selected_file.id}
              />
              <DataFramePreview
                {...this.props}
                key={"df" + selected_file.id}
                datasource_id={selected_file.id}
              />
            </div>
          );
        }
      } else if (selected_node.type === COLUMNS_SELECTION_TYPE) {
        const { columnsUsage } = this.props.columnsUsage;
        console.log("c u");
        console.log(columnsUsage);
        if (!isEmpty(columnsUsage)) {
          rightPane = (
            <ColumnsUsageDetails
              {...this.props}
              key={"colsUsage" + columnsUsage.id}
              details={columnsUsage}
            />
          );
        }
      } else if (selected_node.type === MLEXPERIMENT_TYPE) {
        const { selected_experiment } = this.props.experiment;
        console.log("EXP ! !");
        console.log(selected_experiment);
        if (!isEmpty(selected_experiment)) {
          rightPane = (
            <div>
              <ExperimentDetails
                {...this.props}
                key={"exp-" + selected_experiment.id}
                details={selected_experiment}
              />
              <MLModelList {...this.props} key={"mlmodels"} />
            </div>
          );
        }
      }
    }
    //style={{ height: containerHeight }}
    //
    //minSize={30}
    return (
      <SplitPane split="vertical" style={{ height: containerHeight - 50 }}>
        <div>
          <Graph {...this.props} />
        </div>
        <div>{rightPane}</div>
      </SplitPane>
    );
  }
}

ProjectFlow.propTypes = {
  projectDetail: PropTypes.object.isRequired,
  fileUploadList: PropTypes.object.isRequired,
  experiment: PropTypes.object.isRequired,
  columnsUsage: PropTypes.object.isRequired,
  getProjectDetail: PropTypes.func.isRequired,
  organization_slug: PropTypes.object.isRequired,
  project_id: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  graph: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  projectDetail: state.projectDetail,
  experiment: state.experiment,
  columnsUsage: state.columnsUsage,
  organization_slug: ownProps.match.params,
  project_id: ownProps.match.params,
  auth: state.auth,
  graph: state.graph,
  fileUploadList: state.fileUploadList
});

export default connect(
  mapStateToProps,
  { getProjectDetail }
)(withRouter(ProjectFlow));
