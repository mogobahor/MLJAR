import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { FormGroup, Label, Input } from "reactstrap";

import {
  AvForm,
  AvGroup,
  AvInput,
  AvField,
  AvFeedback
} from "availity-reactstrap-validation";
import { getUploadDestination } from "./UploadFileModalActions";
import { updateUploadedFile } from "../../fileUploadList/FileUploadListActions";

class UploadFileModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: true,
      title: this.props.title,
      description: this.props.description,
      isEditMode: this.props.isEditMode,
      selectedFile: null,
      fileId: this.props.fileId
    };

    this.onChange = this.onChange.bind(this);
    this.onUpload = this.onUpload.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onFileChosen = this.onFileChosen.bind(this);
  }

  onFileChosen(event) {
    this.setState({ selectedFile: event.target.files[0], loaded: 0 });
  }

  onUpload() {
    if (this.state.title === "") {
      return;
    }

    const newFileDataSource = {
      title: this.state.title,
      description: this.state.description,
      file_name: this.state.selectedFile.name
    };
    this.props.getUploadDestination(
      this.props.auth.organization.slug,
      this.props.projectDetail.projectDetail.id,
      this.state.selectedFile,
      newFileDataSource,
      this.props.closeModal
    );
  }

  onUpdate() {
    if (this.state.title === "") {
      return;
    }

    const updatedDetails = {
      title: this.state.title,
      description: this.state.description
    };

    this.props.updateUploadedFile(
      this.props.auth.organization.slug,
      this.props.projectDetail.projectDetail.id,
      this.props.fileId,
      updatedDetails
    );
    this.props.closeModal();
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { status, loaded } = this.props.fileUpload;

    return (
      <Modal
        isOpen={true}
        toggle={this.props.closeModal}
        size={"md"}
        autoFocus={false}
      >
        {!this.state.isEditMode && (
          <ModalHeader>
            {" "}
            <i className="fa fa-file-o" aria-hidden="true" /> Upload new data
            file
          </ModalHeader>
        )}
        {this.state.isEditMode && (
          <ModalHeader>
            {" "}
            <i className="fa fa-file-o" aria-hidden="true" /> Edit uploaded data
            file
          </ModalHeader>
        )}

        <AvForm>
          <ModalBody>
            <AvGroup>
              <Label for="fileTitle">Title</Label>
              <AvInput
                type="text"
                name="title"
                value={this.state.title}
                id="fileTitle"
                placeholder="Name of your data file"
                autoFocus={true}
                onChange={this.onChange}
                required
              />
              <AvFeedback>Title is required to upload new file</AvFeedback>
            </AvGroup>
            <FormGroup>
              <Label for="fileDesc">Description</Label>
              <Input
                type="textarea"
                rows={3}
                name="description"
                value={this.state.description}
                id="fileDesc"
                onChange={this.onChange}
                placeholder="Description of data file (optional)"
              />
            </FormGroup>
            {!this.state.isEditMode && (
              <AvGroup>
                <Label for="fileUpload">Please choose a file</Label>
                <AvField
                  type="file"
                  name="fileName"
                  id="fileUpload"
                  onChange={e => this.onFileChosen(e)}
                  required
                />
              </AvGroup>
            )}

            {status !== "" && (
              <small>
                {status}
                <br />
                Loaded: {loaded}%
              </small>
            )}
          </ModalBody>
          <ModalFooter>
            <Button outline color="secondary" onClick={this.props.closeModal}>
              Cancel
            </Button>
            {!this.state.isEditMode && (
              <Button color="primary" onClick={this.onUpload}>
                Upload file
              </Button>
            )}
            {this.state.isEditMode && (
              <Button color="primary" onClick={this.onUpdate}>
                Update
              </Button>
            )}{" "}
          </ModalFooter>
        </AvForm>
      </Modal>
    );
  }
}

UploadFileModal.propTypes = {
  getUploadDestination: PropTypes.func.isRequired,
  updateUploadedFile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  projectDetail: PropTypes.object.isRequired,
  fileUpload: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  auth: state.auth,
  projectDetail: state.projectDetail,
  fileUpload: state.fileUpload
});

export default connect(
  mapStateToProps,
  { getUploadDestination, updateUploadedFile }
)(withRouter(UploadFileModal));
