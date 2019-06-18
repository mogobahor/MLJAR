import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import isEmpty from "../../validation/isEmpty";
import { Button, UncontrolledTooltip } from "reactstrap";
import { Badge } from "reactstrap";
import confirm from "reactstrap-confirm";
import { deleteColumnsUsage } from "./ColumnsUsageActions";

class ColumnsUsageDetails extends Component {
  componentDidMount() {}
  componentDidUpdate(prevProps) {}

  getBadgesList = (list, badgeType) => {
    if (isEmpty(list)) {
      return <div>Empty list of columns</div>;
    }
    return list.map((l, index) => {
      return (
        <Badge
          color={badgeType}
          pill
          style={{ fontSize: "16px", padding: "5px", margin: "3px" }}
          key={"keyBadge-" + l + index}
        >
          {l}
        </Badge>
      );
    });
  };

  async deleteColumnUsage(usageId, title) {
    let confirmed = await confirm({
      title: "Please confirm",
      message: (
        <p>
          You are going to delete your columns usage: <b>{title}</b>. All items
          associated with this column usage will be irreversibly deleted. Please
          confirm.
        </p>
      ),
      confirmText: "Delete"
    });

    if (confirmed) {
      const { organization } = this.props.auth;
      const { projectDetail } = this.props.projectDetail;

      this.props.deleteColumnsUsage(
        organization.slug,
        projectDetail.id,
        usageId
      );
    }
  }

  render() {
    const { details } = this.props;

    return (
      <div>
        <h4>
          Selection title: {details.title}
          <UncontrolledTooltip
            placement="top"
            target={"deleteColsUsageBtn" + details.id}
          >
            Delete this column usage
          </UncontrolledTooltip>
          <Button
            id={"deleteColsUsageBtn" + details.id}
            color="link"
            className="projectSmallButtons"
            onClick={this.deleteColumnUsage.bind(
              this,
              details.id,
              details.title
            )}
          >
            <i className="fa fa-times" aria-hidden="true" />
          </Button>
        </h4>

        <h5>Target column</h5>
        {this.getBadgesList(details.columns_usage.target, "success")}
        <br />
        <br />
        <h5>
          Input columns{" "}
          <small>(# of columns {details.columns_usage.input.length})</small>
        </h5>
        {this.getBadgesList(details.columns_usage.input, "primary")}
        <br />
        <br />
        {!isEmpty(details.columns_usage.dontUse) && (
          <div>
            <h5>Do not use columns</h5>
            {this.getBadgesList(
              details.columns_usage.dontUse,
              "secondary"
            )}{" "}
          </div>
        )}
      </div>
    );
  }
}

ColumnsUsageDetails.propTypes = {
  deleteColumnsUsage: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => ({});

export default connect(
  mapStateToProps,
  { deleteColumnsUsage }
)(withRouter(ColumnsUsageDetails));
