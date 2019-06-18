import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { getProjectDetail } from "../../actions/projectDetailActions";
import isEmpty from "../../validation/isEmpty";

import { getColumnsUsageList } from "./ColumnsUsageActions";

import { showModal, hideModal } from "../modals/ModalActions";
import ColumnsUsageDetails from "./ColumnsUsageDetails";
import ReactTable from "react-table";
import { Button } from "reactstrap";
class ColumnsUsageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null
    };
  }

  selectColumnsUsage(columnsUsage) {
    console.log("log");
    console.log(columnsUsage);
    this.setState({ selected: columnsUsage._original });
  }
  addColumnsUsageModal() {
    this.props.showModal(
      {
        open: true,
        isEditMode: false,
        closeModal: this.props.hideModal
      },
      "columnsSelection"
    );
  }
  componentDidMount() {
    const { organization_slug } = this.props.organization_slug;
    const { project_id } = this.props.project_id;

    const { projectDetail } = this.props.projectDetail;

    if (isEmpty(projectDetail)) {
      this.props.getProjectDetail(organization_slug, project_id);
    }

    this.props.getColumnsUsageList(organization_slug, project_id);
  }
  componentDidUpdate(prevProps) {}

  render() {
    const { organization_slug } = this.props.organization_slug;
    const { project_id } = this.props.project_id;

    const { columnsUsageList } = this.props.columnsUsage;
    console.log(columnsUsageList);

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
        Header: () => <b>Target</b>,
        accessor: "target_name"
      },
      {
        Header: () => <b># of input features</b>,
        accessor: "input_cnt"
      }
    ];

    console.log("cols");
    console.log(this.state.selected);

    return (
      <div className="container-fluid">
        <h3>
          <i className="fa fa-list-ul" aria-hidden="true" /> Columns usage
          <Button
            color="success"
            className="float-right"
            onClick={this.addColumnsUsageModal.bind(this)}
          >
            <i className="fa fa-plus" aria-hidden="true" /> Add new columns
            selection
          </Button>
        </h3>

        <hr />
        {!isEmpty(columnsUsageList) && (
          <ReactTable
            data={columnsUsageList}
            columns={columns}
            minRows={0}
            showPagination={false}
            className="-highlight -striped"
            getTrProps={(state, rowInfo) => ({
              onClick: this.selectColumnsUsage.bind(this, rowInfo.row)
            })}
          />
        )}
        {!this.state.selected && (
          <p>Please select columns usage in the table to check its details.</p>
        )}
        {this.state.selected && (
          <ColumnsUsageDetails
            {...this.props}
            key={"colsUsage"}
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

ColumnsUsageList.propTypes = {
  projectDetail: PropTypes.object.isRequired,
  getProjectDetail: PropTypes.func.isRequired,
  getColumnsUsageList: PropTypes.func.isRequired,
  organization_slug: PropTypes.object.isRequired,
  project_id: PropTypes.object.isRequired,

  columnsUsage: PropTypes.object.isRequired,

  //dataFrameList: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  projectDetail: state.projectDetail,
  organization_slug: ownProps.match.params,
  project_id: ownProps.match.params,
  columnsUsage: state.columnsUsage,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getColumnsUsageList, getProjectDetail, showModal, hideModal }
)(withRouter(ColumnsUsageList));
