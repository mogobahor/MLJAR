import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

//import moment from "moment";

class MLModelDetails extends Component {
  componentDidMount() {}
  componentDidUpdate(prevProps) {}

  render() {
    const { details } = this.props;
    return (
      <div className="border-bottom">
        <div className="row mb-3 mt-3">
          <div className="col-12">
            Model id: {details.id})
            <br />
          </div>
        </div>
      </div>
    );
  }
}

MLModelDetails.propTypes = {
  deleteExperiment: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => ({});

export default connect(
  mapStateToProps,
  {}
)(withRouter(MLModelDetails));
