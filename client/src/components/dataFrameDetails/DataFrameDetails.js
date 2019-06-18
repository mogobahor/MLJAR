import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
//import PropTypes from "prop-types";

//import { getDataFrames } from "./dataFrameListActions";
//import moment from "moment";

class DataFrameDetails extends Component {
  componentDidMount() {
    console.log(this.props);
    //const { organization_slug } = this.props.organization_slug;
    //const { project_id } = this.props.project_id;
    //  this.props.getDataFrames(organization_slug, project_id);
  }
  componentDidUpdate(prevProps) {}

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-10">
            <h3>Data Frame Details</h3>
          </div>
        </div>
      </div>
    );
  }
}

DataFrameDetails.propTypes = {
  //getDataFrames: PropTypes.func.isRequired,
  //organization_slug: PropTypes.object.isRequired,
  //project_id: PropTypes.object.isRequired,
  //dataFrameList: PropTypes.object.isRequired,
  //auth: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  //organization_slug: ownProps.match.params,
  //project_id: ownProps.match.params,
  //dataFrameList: state.dataFrameList,
  //auth: state.auth
});

export default connect(
  mapStateToProps,
  {}
)(withRouter(DataFrameDetails));
