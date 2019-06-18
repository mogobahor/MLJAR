import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { getMLModels } from "./MLModelActions";
import { getProjectDetail } from "../../actions/projectDetailActions";
import isEmpty from "../../validation/isEmpty";
//import MLModelDetails from "./MLModelDetails";

import ReactTable from "react-table";
import moment from "moment";

class MLModelList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null
    };
  }

  selectMLModel(mlmodel) {
    this.setState({ selected: mlmodel._original });
  }

  componentDidMount() {
    const { organization_slug } = this.props.organization_slug;
    const { project_id } = this.props.project_id;
    const { projectDetail } = this.props.projectDetail;

    if (isEmpty(projectDetail)) {
      this.props.getProjectDetail(organization_slug, project_id);
    }
    console.log(organization_slug, project_id);
    this.props.getMLModels(organization_slug, project_id);
  }
  componentDidUpdate(prevProps) {}

  render() {
    const { organization_slug } = this.props.organization_slug;
    const { project_id } = this.props.project_id;
    const { mlmodels } = this.props.mlmodel;

    console.log("mlmodels");
    console.log(mlmodels);

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
        Header: () => <b>Algorithm</b>,
        accessor: "model_type"
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
          <i className="fa fa-cogs" aria-hidden="true" /> ML Models
        </h3>
        <hr />
        {isEmpty(mlmodels) && (
          <div>
            List of ML models is empty. Please add your first ML Experiment.
            Please go to 'Experiments' in the left menu.
          </div>
        )}
        {!isEmpty(mlmodels) && (
          <ReactTable
            data={mlmodels}
            columns={columns}
            minRows={0}
            showPagination={false}
            className="-highlight -striped"
            getTrProps={(state, rowInfo) => ({
              onClick: this.selectMLModel.bind(this, rowInfo.row)
            })}
          />
        )}

        {!isEmpty(mlmodels) && isEmpty(this.state.selected) && (
          <p>
            <br />
            Please select ML model in the table above to check its details.
          </p>
        )}
        <br />

        <Link to={"/" + organization_slug + "/project/" + project_id}>
          <i className="fa fa-long-arrow-left" aria-hidden="true" /> Back
        </Link>
      </div>
    );
  }
}

MLModelList.propTypes = {
  getMLModels: PropTypes.func.isRequired,

  projectDetail: PropTypes.object.isRequired,
  experiment: PropTypes.object.isRequired,
  mlmodel: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,

  getProjectDetail: PropTypes.func.isRequired,

  organization_slug: PropTypes.object.isRequired,
  project_id: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  projectDetail: state.projectDetail,

  experiment: state.experiment,
  mlmodel: state.mlmodel,
  auth: state.auth,
  organization_slug: ownProps.match.params,
  project_id: ownProps.match.params
});

export default connect(
  mapStateToProps,
  { getMLModels, getProjectDetail }
)(withRouter(MLModelList));
