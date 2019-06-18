import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import isEmpty from "../../validation/isEmpty";

import TextFieldGroup from "../common/TextFieldGroup";
//import { Label } from "react-bootstrap";
import { getUploadDestination } from "../../actions/fileUploadActions.js";

class AddDataSourceView extends Component {
  constructor(props) {
    console.log("AddDataSourceView");
    super(props);
    this.state = {
      params: {},
      title: "",
      description: "",
      file_name: "",
      uploadStatusMsg: "",
      loaded: 0,
      errors: {
        params: {}
      }
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    console.log(
      "AddDataSourceView",
      this.props.auth.user.username,
      this.props.projectDetail.projectDetail
    );
  }

  componentWillReceiveProps(nextProps) {
    if (!isEmpty(nextProps.errors)) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onSubmit(e) {
    e.preventDefault();

    //const projectData = {
    //  title: this.state.title,
    //  description: this.state.description
    //};
    const selectedFile = e.target.file_name.files[0];
    console.log("Selected File", selectedFile, selectedFile.name);
    console.log("onSubmit get upload destination", selectedFile.name);

    const newFileDataSource = {
      title: this.state.title,
      description: this.state.description,
      file_name: selectedFile.name
    };
    this.props.getUploadDestination(
      this.props.auth.organization.slug,
      this.props.projectDetail.projectDetail.id,
      selectedFile,
      newFileDataSource
    );
    // var data = new FormData();
    //    data.append('file', selectedFile);
    //    console.log('Form Data', data);
    //this.props.addProject(projectData);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors } = this.state;

    const { projectDetail } = this.props.projectDetail;

    if (isEmpty(projectDetail)) {
      return (
        <div>
          <h3>
            Can not add new data source. Sorry! Please select a project first.{" "}
          </h3>
          <Link to="/projects" className="btn btn-default mt-2">
            Back to projects list
          </Link>
        </div>
      );
    }
    const link_back = "/project/" + projectDetail.id;

    console.log(this.props.fileUpload.destination);
    console.log(this.props.fileUpload.destination.absolute_path);
    const { destination } = this.props.fileUpload;

    console.log(">>>render", destination);
    //console.log(">>>render", fileUpload.destination);

    return (
      <div className="container">
        <h1>Add data source</h1>
        <hr />
        {"non_field_errors" in errors && (
          <div className="badge badge-danger mb-3">
            {errors.non_field_errors}
          </div>
        )}

        <p>Data upload from CSV file</p>

        <form onSubmit={this.onSubmit}>
          <TextFieldGroup
            placeholder="Data source name"
            name="title"
            value={this.state.title}
            onChange={this.onChange}
            error={"params" in errors ? errors.params.arg1 : []}
          />
          <TextFieldGroup
            placeholder="Description of data source"
            name="description"
            value={this.state.description}
            onChange={this.onChange}
            error={"params" in errors ? errors.params.arg2 : []}
          />
          <b>Please choose a file</b>

          <input type="file" name="file_name" id="" onChange={this.onChange} />

          <div> Upload progress: {Math.round(this.state.loaded, 2)} %</div>
          {this.state.uploadStatusMsg ? (
            <p>{this.state.uploadStatusMsg}</p>
          ) : (
            <p>{this.props.fileUpload.status}</p>
          )}
          <input type="submit" value="Submit" className="btn btn-info mt-2" />
          <Link to={link_back} className="btn btn-default mt-2">
            Back
          </Link>
        </form>
      </div>
    );
  }
}

AddDataSourceView.propTypes = {
  //addProject: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  projectDetail: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  fileUpload: PropTypes.object.isRequired,
  getUploadDestination: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors,
  auth: state.auth,
  projectDetail: state.projectDetail,
  fileUpload: state.fileUpload
});

export default connect(
  mapStateToProps,
  { getUploadDestination }
)(withRouter(AddDataSourceView));
