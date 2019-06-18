import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { getPredictions } from "./PredictionActions";
import { getProjectDetail } from "../../actions/projectDetailActions";

import isEmpty from "../../validation/isEmpty";

import { Button } from "reactstrap";
import { showModal, hideModal } from "../modals/ModalActions";
import ReactTable from "react-table";

import moment from "moment";

class PredictionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null
    };
  }

  selectPrediction(experiment) {
    this.setState({ selected: experiment._original });
  }

  componentDidMount() {
    const { organization_slug } = this.props.organization_slug;
    const { project_id } = this.props.project_id;
    const { projectDetail } = this.props.projectDetail;

    if (isEmpty(projectDetail)) {
      this.props.getProjectDetail(organization_slug, project_id);
    }
    this.props.getPredictions(organization_slug, project_id);
  }
  componentDidUpdate(prevProps) {}

  createPredictionModal() {
    this.props.showModal(
      {
        open: true,
        closeModal: this.props.hideModal
      },
      "computePrediction"
    );
  }

  render() {
    const { organization_slug } = this.props.organization_slug;
    const { project_id } = this.props.project_id;
    const { predictions } = this.props.prediction;

    console.log("predictions");
    console.log(predictions);

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
        Header: () => <b>Input data</b>,
        accessor: "parent_dataframe"
      },
      {
        Header: () => <b>Model</b>,
        accessor: "parent_mlmodel"
      },
      {
        Header: () => <b>Predictions</b>,
        accessor: "result_dataframe"
      },
      {
        Header: () => <b>Status</b>,
        accessor: "status"
      },
      {
        Header: () => <b>Updated at</b>,
        accessor: "updated_at",
        Cell: cellInfo =>
          moment(cellInfo.row.updated_at).format("MMMM Do YYYY, h:mm:ss a")
      }
    ];

    return (
      <div className="container-fluid">
        <h3>
          <i className="fa fa-bolt" aria-hidden="true" /> Predictions
          <Button
            color="success"
            className="float-right"
            onClick={this.createPredictionModal.bind(this)}
          >
            <i className="fa fa-plus" aria-hidden="true" /> Compute predictions
          </Button>
        </h3>

        <hr />

        {isEmpty(predictions) && (
          <div>
            List of predictions is empty. Please compute your first preidctions.
          </div>
        )}
        {!isEmpty(predictions) && (
          <ReactTable
            data={predictions}
            columns={columns}
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

PredictionList.propTypes = {
  projectDetail: PropTypes.object.isRequired,
  getProjectDetail: PropTypes.func.isRequired,

  organization_slug: PropTypes.object.isRequired,
  project_id: PropTypes.object.isRequired,
  prediction: PropTypes.object.isRequired,

  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  projectDetail: state.projectDetail,
  prediction: state.prediction,
  organization_slug: ownProps.match.params,
  project_id: ownProps.match.params,

  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getProjectDetail, getPredictions, showModal, hideModal }
)(withRouter(PredictionList));
