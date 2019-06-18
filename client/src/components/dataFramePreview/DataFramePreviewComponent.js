import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import isEmpty from "../../validation/isEmpty";

import ReactTable from "react-table";

class DataFramePreviewComponent extends Component {
  componentDidMount() {}
  componentDidUpdate(prevProps) {}

  render() {
    const { data, executing } = this.props;

    if (executing) {
      return <div>Executing, please wait ...</div>;
    }
    if (isEmpty(data)) {
      return <div> Empty dataframe </div>;
    }

    let cols = Object.keys(data[0]);

    let columns = [];
    for (let i = 0; i < cols.length; i += 1) {
      columns.push({
        Header: () => <b>{cols[i]}</b>,
        accessor: cols[i]
      });
    }

    return (
      <div>
        <ReactTable
          data={data}
          columns={columns}
          className="-highlight -striped"
          minRows={0}
          defaultPageSize={10}
          showPagination={data.length > 10}
        />
        Rows: {data.length}
      </div>
    );
  }
}

DataFramePreviewComponent.propTypes = {
  //
};

const mapStateToProps = (state, ownProps) => ({
  //
});

export default connect(
  mapStateToProps,
  {}
)(withRouter(DataFramePreviewComponent));
