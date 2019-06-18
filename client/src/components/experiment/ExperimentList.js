import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { getExperiments } from "./ExperimentActions";
import { getProjectDetail } from "../../actions/projectDetailActions";

import isEmpty from "../../validation/isEmpty";
import ExperimentDetails from "./ExperimentDetails";
import { Button } from "reactstrap";
import { showModal, hideModal } from "../modals/ModalActions";
import ReactTable from "react-table";

import moment from "moment";

class ExperimentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null
    };
  }

  selectExperiment(experiment) {
    this.setState({ selected: experiment._original });
  }

  componentDidMount() {
    const { organization_slug } = this.props.organization_slug;
    const { project_id } = this.props.project_id;
    const { projectDetail } = this.props.projectDetail;

    if (isEmpty(projectDetail)) {
      this.props.getProjectDetail(organization_slug, project_id);
    }
    this.props.getExperiments(organization_slug, project_id);
  }
  componentDidUpdate(prevProps) {}

  createExperimentModal() {
    this.props.showModal(
      {
        open: true,
        isEditMode: false,
        closeModal: this.props.hideModal
      },
      "createExperiment"
    );
  }

  render() {
    const { organization_slug } = this.props.organization_slug;
    const { project_id } = this.props.project_id;
    const { experiments } = this.props.experiment;

    console.log(experiments);

    let columns = [
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
        Header: () => <b>Title</b>,
        accessor: "title"
      },
      {
        Header: () => <b>Status</b>,
        accessor: "status"
      },
      {
        Header: () => <b>Models count</b>,
        accessor: "models_cnt"
      },
      {
        Header: () => <b>Started at</b>,
        accessor: "created_at",
        Cell: cellInfo =>
          moment(cellInfo.row.created_at).format("MMMM Do YYYY, h:mm:ss a")
      }
    ];

    return (
      <div className="container-fluid">
        <h3>
          <i className="fa fa-flask" aria-hidden="true" /> ML Experiments
          <Button
            color="success"
            className="float-right"
            onClick={this.createExperimentModal.bind(this)}
          >
            <i className="fa fa-plus" aria-hidden="true" /> Add new ML
            Experiment
          </Button>
        </h3>

        <hr />

        {isEmpty(experiments) && (
          <div>
            Experiments list is empty. Please add your first ML experiment by
            clicking the add button above.
          </div>
        )}
        {!isEmpty(experiments) && (
          <ReactTable
            data={experiments}
            columns={columns}
            minRows={0}
            showPagination={false}
            className="-highlight -striped"
            getTrProps={(state, rowInfo) => ({
              onClick: this.selectExperiment.bind(this, rowInfo.row)
            })}
          />
        )}
        {!isEmpty(experiments) && isEmpty(this.state.selected) && (
          <p>
            <br />
            Please select experiment in the table above to check its details.
          </p>
        )}
        {!isEmpty(this.state.selected) && (
          <ExperimentDetails
            {...this.props}
            key={"mlexp"}
            details={this.state.selected}
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

ExperimentList.propTypes = {
  projectDetail: PropTypes.object.isRequired,
  getProjectDetail: PropTypes.func.isRequired,
  getExperiments: PropTypes.func.isRequired,
  organization_slug: PropTypes.object.isRequired,
  project_id: PropTypes.object.isRequired,
  experiment: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  projectDetail: state.projectDetail,
  organization_slug: ownProps.match.params,
  project_id: ownProps.match.params,
  experiment: state.experiment,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getExperiments, getProjectDetail, showModal, hideModal }
)(withRouter(ExperimentList));
