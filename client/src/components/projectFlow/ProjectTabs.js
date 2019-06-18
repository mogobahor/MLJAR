import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import isEmpty from "../../validation/isEmpty";
//import moment from "moment";
import { getProjectDetail } from "../../actions/projectDetailActions";

import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import classnames from "classnames";

class ProjectTabs extends Component {
  componentDidMount() {
    const { organization_slug } = this.props.organization_slug;
    const { project_id } = this.props.project_id;
    const { projectDetail } = this.props.projectDetail;

    if (isEmpty(projectDetail)) {
      this.props.getProjectDetail(organization_slug, project_id);
    }
  }

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);

    const tabsInit = [{ id: 0, msg: "a" }, { id: 1, msg: "b" }];

    this.state = {
      tabs: tabsInit,
      activeTab: 0
    };
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  tabsNavigation = () => {
    let items = [];
    for (let i = 0; i < this.state.tabs.length; i += 1) {
      const tab = this.state.tabs[i];

      items.push(
        <NavItem key={i}>
          <NavLink
            className={classnames({ active: this.state.activeTab === i })}
            onClick={() => {
              this.toggle(tab.id);
            }}
          >
            Tab {i}
          </NavLink>
        </NavItem>
      );
    }
    return <Nav tabs>{items}</Nav>;
  };

  tabsContent = () => {
    let items = [];
    for (let i = 0; i < this.state.tabs.length; i += 1) {
      const tab = this.state.tabs[i];
      items.push(
        <TabPane tabId={tab.id} key={i}>
          {tab.msg}
        </TabPane>
      );
    }

    return <TabContent activeTab={this.state.activeTab}>{items}</TabContent>;
  };

  render() {
    return (
      <div>
        {this.tabsNavigation()}
        {this.tabsContent()}
      </div>
    );
  }
}

ProjectTabs.propTypes = {
  projectDetail: PropTypes.object.isRequired,
  getProjectDetail: PropTypes.func.isRequired,
  organization_slug: PropTypes.object.isRequired,
  project_id: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  graph: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  projectDetail: state.projectDetail,
  organization_slug: ownProps.match.params,
  project_id: ownProps.match.params,
  auth: state.auth,
  graph: state.graph
});

export default connect(
  mapStateToProps,
  { getProjectDetail }
)(withRouter(ProjectTabs));
