import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { getProjectDetail } from "../../actions/projectDetailActions";
import isEmpty from "../../validation/isEmpty";

import { getUploadedFiles } from "./FileUploadListActions";
import FileUploadDetails from "./FileUploadDetails";
import { showModal, hideModal } from "../modals/ModalActions";
import { Button } from "reactstrap";

class FileUploadList extends Component {
  componentDidMount() {
    const { organization_slug } = this.props.organization_slug;
    const { project_id } = this.props.project_id;

    const { projectDetail } = this.props.projectDetail;

    if (isEmpty(projectDetail)) {
      this.props.getProjectDetail(organization_slug, project_id);
    }

    this.props.getUploadedFiles(organization_slug, project_id);
  }
  componentDidUpdate(prevProps) {}

  uploadFileModal() {
    this.props.showModal(
      {
        open: true,
        title: "",
        description: "",
        isEditMode: false,
        closeModal: this.props.hideModal
      },
      "uploadFile"
    );
  }

  render() {
    const { organization_slug } = this.props.organization_slug;
    const { project_id } = this.props.project_id;
    const { files, loading } = this.props.fileUploadList;
    let items;

    if (loading) {
      items = <div>Loading uploaded files ...</div>;
    } else {
      if (!isEmpty(files) && files.length > 0) {
        items = files.map(uploadedFile => {
          return (
            <FileUploadDetails
              details={uploadedFile}
              {...this.props}
              key={uploadedFile.id}
            />
          );
        });
      } else {
        items = (
          <div>
            Uploaded files list is empty. Please upload your first data file.
          </div>
        );
      }
    }

    return (
      <div className="container-fluid">
        <h3>
          <i className="fa fa-file-o" aria-hidden="true" /> Uploaded files
          <Button
            color="success"
            className="float-right"
            onClick={this.uploadFileModal.bind(this)}
          >
            <i className="fa fa-plus" aria-hidden="true" /> Upload new file
          </Button>
        </h3>
        <hr />
        <div className="container-fluid">
          <div className="row  mb-3 mt-3">{items}</div>
        </div>
        <br />
        <Link to={"/" + organization_slug + "/project/" + project_id}>
          <i className="fa fa-long-arrow-left" aria-hidden="true" /> Back
        </Link>
      </div>
    );
  }
}

FileUploadList.propTypes = {
  projectDetail: PropTypes.object.isRequired,
  getProjectDetail: PropTypes.func.isRequired,
  getUploadedFiles: PropTypes.func.isRequired,
  organization_slug: PropTypes.object.isRequired,
  project_id: PropTypes.object.isRequired,

  fileUploadList: PropTypes.object.isRequired,

  //dataFrameList: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  projectDetail: state.projectDetail,
  organization_slug: ownProps.match.params,
  project_id: ownProps.match.params,
  fileUploadList: state.fileUploadList,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getProjectDetail, getUploadedFiles, showModal, hideModal }
)(withRouter(FileUploadList));
