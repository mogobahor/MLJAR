import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Nav, NavItem } from "reactstrap";

import { Link } from "react-router-dom";
import isEmpty from "../../validation/isEmpty";
import classnames from "classnames";

import { webSocketDisconnect } from "../websocketContainer/WebSocketActions";

class LayoutWithLeftNavbar extends React.Component {
  //constructor(props) {
  //    super(props);
  //}

  componentDidMount() {
    /*const { organization_slug } = this.props.organization_slug;
    const { project_id } = this.props.project_id;

    const { projectDetail } = this.props.projectDetail;

    if (isEmpty(projectDetail)) {
      this.props.getProjectDetail(organization_slug, project_id);
  }*/
  }
  onWebsocketDisconnectClick() {
    this.props.webSocketDisconnect();
  }

  render() {
    const { organization } = this.props.auth;
    const { projectDetail } = this.props.projectDetail;

    const project_link = isEmpty(this.props.projectDetail.projectDetail)
      ? ""
      : "/" + organization.slug + "/project/" + projectDetail.id;

    const uploaded_files_link = isEmpty(this.props.projectDetail.projectDetail)
      ? ""
      : "/" + organization.slug + "/project/" + projectDetail.id + "/uploaded";

    const data_frames_link = isEmpty(this.props.projectDetail.projectDetail)
      ? ""
      : "/" +
        organization.slug +
        "/project/" +
        projectDetail.id +
        "/dataframes";

    const columns_usage_link = isEmpty(this.props.projectDetail.projectDetail)
      ? ""
      : "/" +
        organization.slug +
        "/project/" +
        projectDetail.id +
        "/columns_usage_list";
    const experiments_link = isEmpty(this.props.projectDetail.projectDetail)
      ? ""
      : "/" +
        organization.slug +
        "/project/" +
        projectDetail.id +
        "/experiments";
    const mlmodels_link = isEmpty(this.props.projectDetail.projectDetail)
      ? ""
      : "/" + organization.slug + "/project/" + projectDetail.id + "/models";

    const predictions_link = isEmpty(this.props.projectDetail.projectDetail)
      ? ""
      : "/" +
        organization.slug +
        "/project/" +
        projectDetail.id +
        "/predictions";

    const queries_link = isEmpty(this.props.projectDetail.projectDetail)
      ? ""
      : "/" + organization.slug + "/project/" + projectDetail.id + "/queries";

    const { status } = this.props.webSocket;
    let leftNav = (
      <div className="sidebar">
        <Nav vertical>
          <NavItem className={"nav-item-left"}>
            <Link to={project_link} className={"link-left nav-link"}>
              <i className="fa fa-home icon-left" aria-hidden="true" /> Project
              details
            </Link>
          </NavItem>
          <NavItem className={"nav-item-left"}>
            <Link to={uploaded_files_link} className={"link-left nav-link"}>
              <i className="fa fa-file-o icon-left" aria-hidden="true" />{" "}
              Uploaded files
            </Link>
          </NavItem>
          <NavItem className={"nav-item-left"}>
            <Link to={queries_link} className={"link-left nav-link"}>
              <i
                className="fa fa-pencil-square-o icon-left"
                aria-hidden="true"
              />{" "}
              Queries
            </Link>
          </NavItem>
          <NavItem className={"nav-item-left"}>
            <Link to={data_frames_link} className={"link-left nav-link"}>
              <i className="fa fa-th icon-left" aria-hidden="true" /> Data
              frames
            </Link>
          </NavItem>
          <NavItem className={"nav-item-left"}>
            <Link to={columns_usage_link} className={"link-left nav-link"}>
              <i className="fa fa-list-ul icon-left" aria-hidden="true" />{" "}
              Columns usage
            </Link>
          </NavItem>
          <NavItem className={"nav-item-left"}>
            <Link to={experiments_link} className={"link-left nav-link"}>
              <i className="fa fa-flask icon-left" aria-hidden="true" />{" "}
              Experiments
            </Link>
          </NavItem>
          <NavItem className={"nav-item-left"}>
            <Link to={mlmodels_link} className={"link-left nav-link"}>
              <i className="fa fa-cogs icon-left" aria-hidden="true" /> ML
              Models
            </Link>
          </NavItem>
          <NavItem className={"nav-item-left"}>
            <Link to={predictions_link} className={"link-left nav-link"}>
              <i className="fa fa-bolt icon-left" aria-hidden="true" />{" "}
              Predictions
            </Link>
          </NavItem>
          {/*<NavItem className={"nav-item-left"}>
            <Link to={predictions_link} className={"link-left nav-link"}>
              <i className="fa fa-bar-chart-o icon-left" aria-hidden="true" />{" "}
              Charts
            </Link>
          </NavItem>*/}
          {/*<NavItem className={"nav-item-left"}>
            <Link to={predictions_link} className={"link-left nav-link"}>
              <i className="fa fa-clock-o icon-left" aria-hidden="true" />{" "}
              Actions
            </Link>
          </NavItem>*/}
          {/*<NavItem className={"nav-item-left"}>
            <Link to={predictions_link} className={"link-left nav-link"}>
              <i className="fa fa-tasks icon-left" aria-hidden="true" /> Tasks
            </Link>
          </NavItem>*/}
        </Nav>

        <div
          className="text-muted"
          style={{ bottom: "0", position: "absolute", padding: "5px" }}
        >
          <span className="badge badge-light">WebSocket:</span>
          <span
            className={classnames(
              "badge",
              { "badge-success": status === "connected" },
              { "badge-info": status === "connecting" },
              { "badge-danger": status === "disconnected" }
            )}
            onClick={this.onWebsocketDisconnectClick.bind(this)}
          >
            {status}
          </span>
        </div>
      </div>
    );

    return (
      <div className="container-fluid">
        <div className="row">
          {leftNav}
          <div className="main container-fluid">{this.props.children}</div>
        </div>
      </div>
    );
  }
}

LayoutWithLeftNavbar.propTypes = {
  auth: PropTypes.object.isRequired,
  projectDetail: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  webSocket: PropTypes.object.isRequired,
  webSocketDisconnect: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => {
  return {
    auth: state.auth,
    projectDetail: state.projectDetail,
    webSocket: state.webSocket
  };
};

export default connect(
  mapStateToProps,
  { webSocketDisconnect }
)(LayoutWithLeftNavbar);
