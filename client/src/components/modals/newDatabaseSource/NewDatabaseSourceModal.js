import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
//import { Form, FormGroup, Label, Input } from "reactstrap";
import { addDatabaseSource } from "./NewDatabaseSourceActions";

import isEmpty from "../../../validation/isEmpty";

import {
  AvForm,
  // AvGroup,
  //  AvInput,
  AvField
  //  AvFeedback
} from "availity-reactstrap-validation";

class NewDatabaseSourceModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: null,
      host: null,
      port: null,
      user: null,
      password: null,
      database: null,
      isShow: true,
      errorMessage: ""
    };

    this.onChange = this.onChange.bind(this);
    this.addDatabaseSource = this.addDatabaseSource.bind(this);
  }

  componentDidMount() {}

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
    this.setState({
      errorMessage: ""
    });
  }

  validate(f, errMsg) {
    if (isEmpty(f)) {
      this.setState({
        errorMessage: errMsg
      });
      return false;
    }
    return true;
  }

  addDatabaseSource() {
    console.log("addDatabaseSource");
    console.log(this.state);

    if (!this.validate(this.state.name, "Please provide connection name"))
      return;
    if (!this.validate(this.state.host, "Please provide host")) return;
    if (!this.validate(this.state.port, "Please provide port")) return;
    if (!this.validate(this.state.user, "Please provide user name")) return;
    if (!this.validate(this.state.password, "Please provide password")) return;
    if (!this.validate(this.state.database, "Please provide database name"))
      return;
    const dbSettings = {
      db_type: "pg",
      name: this.state.name,
      settings: {
        host: this.state.host,
        port: this.state.port,
        user: this.state.user,
        password: this.state.password,
        database: this.state.database
      }
    };
    console.log(dbSettings);
    const { organization } = this.props.auth;

    this.props.addDatabaseSource(
      organization.slug,
      dbSettings,
      this.props.closeModal
    );
  }

  render() {
    return (
      <Modal
        isOpen={true}
        onExit={this.onExit}
        toggle={this.props.closeModal}
        size={"md"}
      >
        <ModalHeader>
          <i className="fa fa-database" aria-hidden="true" /> New database
          connection
        </ModalHeader>
        <ModalBody>
          <div className="container">
            <AvForm>
              <AvField
                name="name"
                label="Name"
                value={this.state.name}
                onChange={this.onChange}
                placeholder="Database connection name"
                required
              />
              <AvField
                name="host"
                label="Host"
                value={this.state.host}
                onChange={this.onChange}
                placeholder="127.0.0.1"
                required
              />
              <AvField
                name="port"
                label="Port"
                type="number"
                value={this.state.port}
                onChange={this.onChange}
                placeholder="5432"
                required
              />
              <AvField
                name="user"
                label="User"
                value={this.state.user}
                onChange={this.onChange}
                placeholder="User"
                required
              />
              <AvField
                name="password"
                type="password"
                label="Password"
                value={this.state.password}
                onChange={this.onChange}
                placeholder="Password"
                required
              />
              <AvField
                name="database"
                label="Database"
                value={this.state.database}
                onChange={this.onChange}
                placeholder="Database"
                required
              />
            </AvForm>
          </div>
        </ModalBody>
        <ModalFooter>
          <p style={{ color: "red" }}>{this.state.errorMessage}</p>
          <Button color="secondary" onClick={this.props.closeModal} outline>
            Cancel
          </Button>
          <Button color="primary" onClick={this.addDatabaseSource}>
            Save
          </Button>{" "}
        </ModalFooter>
      </Modal>
    );
  }
}

NewDatabaseSourceModal.propTypes = {
  addDatabaseSource: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { addDatabaseSource }
)(withRouter(NewDatabaseSourceModal));
