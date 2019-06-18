import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { signOutUser } from "../../actions/authActions";

import isEmpty from "../../validation/isEmpty";

import {
  Collapse,
  Navbar,
  //NavbarToggler,
  Nav,
  NavItem
  //NavLink,
  //  UncontrolledDropdown,
  //  DropdownToggle,
  //  DropdownMenu,
  //  DropdownItem
} from "reactstrap";
import { showModal, hideModal } from "../modals/ModalActions";

class NavbarMain extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };

    this.uploadFileModal = this.uploadFileModal.bind(this);
    this.columnsSelectionModal = this.columnsSelectionModal.bind(this);
    this.createExperimentModal = this.createExperimentModal.bind(this);
  }

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

  columnsSelectionModal() {
    this.props.showModal(
      {
        open: true,
        isEditMode: false,
        closeModal: this.props.hideModal
      },
      "columnsSelection"
    );
  }

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

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  onLogoutClick(e) {
    e.preventDefault();
    this.props.signOutUser();
  }

  render() {
    const { isAuthenticated, user, organization } = this.props.auth;

    const guestLinks = (
      <Nav className="ml-auto" navbar>
        <NavItem>
          <Link to="/login/" className="nav-link">
            Login
          </Link>
        </NavItem>
      </Nav>
    );

    const authLinks = (
      <Nav className="ml-auto" navbar>
        <NavItem>
          <Link
            to="/logout/"
            className="nav-link"
            onClick={this.onLogoutClick.bind(this)}
          >
            Logout [{user.username}]
          </Link>
        </NavItem>
      </Nav>
    );
    const { projectDetail } = this.props.projectDetail;
    const project_link = isEmpty(projectDetail)
      ? false
      : "/" +
        organization.slug +
        "/project/" +
        this.props.projectDetail.projectDetail.id;

    return (
      <Navbar light expand="md" className="mb-3 align-items-baseline">
        <Link to="/" className="navbar-brand">
          mljar
        </Link>
        <Collapse isOpen={this.state.isOpen} navbar>
          {isAuthenticated && (
            <Nav className="mr-auto" navbar>
              {isAuthenticated && (
                <NavItem>
                  <Link
                    to={"/" + organization.slug + "/projects/"}
                    className="nav-link"
                  >
                    All projects
                  </Link>
                </NavItem>
              )}

              {project_link && (
                <NavItem>
                  <Link to={project_link} className="nav-link">
                    <strong>
                      <i className="fa fa-folder-open-o" aria-hidden="true" />{" "}
                      {this.props.projectDetail.projectDetail.title}
                    </strong>
                  </Link>
                </NavItem>
              )}
            </Nav>
          )}
          {isAuthenticated ? authLinks : guestLinks}
        </Collapse>
      </Navbar>
    );
  }
}

NavbarMain.propTypes = {
  auth: PropTypes.object.isRequired,
  projectDetail: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  auth: state.auth,
  projectDetail: state.projectDetail
});

export default connect(
  mapStateToProps,
  { signOutUser, showModal, hideModal }
)(NavbarMain);
