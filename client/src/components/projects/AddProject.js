import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import isEmpty from "../../validation/isEmpty";

import TextFieldGroup from "../common/TextFieldGroup";

import { addProject } from "../projectList/ProjectListActions";

class AddProjectView extends Component {
  constructor(props) {
    console.log("AddProjectView");
    super(props);
    this.state = {
      params: {},
      title: "",
      description: "",
      errors: {
        params: {}
      }
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!isEmpty(nextProps.errors)) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onSubmit(e) {
    e.preventDefault();

    const projectData = {
      title: this.state.title,
      description: this.state.description
    };
    console.log("onSubmit projectData", projectData);
    this.props.addProject(projectData);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors } = this.state;

    return (
      <div className="container">
        <h1>Add new project</h1>
        <hr />
        {"non_field_errors" in errors && (
          <div className="badge badge-danger mb-3">
            {errors.non_field_errors}
          </div>
        )}

        <form onSubmit={this.onSubmit}>
          <TextFieldGroup
            placeholder="Project title"
            name="title"
            value={this.state.title}
            onChange={this.onChange}
            error={"params" in errors ? errors.params.arg1 : []}
          />
          <TextFieldGroup
            placeholder="Description, what is your goal?"
            name="description"
            value={this.state.description}
            onChange={this.onChange}
            error={"params" in errors ? errors.params.arg2 : []}
          />
          <input type="submit" value="Submit" className="btn btn-info mt-2" />
          <Link to="/projects" className="btn btn-default mt-2">
            Back
          </Link>
        </form>
      </div>
    );
  }
}

AddProjectView.propTypes = {
  addProject: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { addProject }
)(withRouter(AddProjectView));
