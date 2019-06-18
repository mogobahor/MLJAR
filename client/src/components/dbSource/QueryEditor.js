import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { getProjectDetail } from "../../actions/projectDetailActions";
import isEmpty from "../../validation/isEmpty";

import { showModal, hideModal } from "../modals/ModalActions";
import { Button } from "reactstrap";
//import brace from "brace";
import AceEditor from "react-ace";
import "brace/mode/mysql";
import "brace/theme/textmate";
import "brace/ext/language_tools";
import "brace/ext/searchbox";
import { Label, Input, Col, Row } from "reactstrap";
import {
  getDatabaseSourceList,
  createQuery,
  getQuery,
  updateQuery,
  executeQuery
} from "./DatabaseSourceActions";
import DataFramePreviewComponent from "../dataFramePreview/DataFramePreviewComponent";
import classnames from "classnames";
class QueryEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      query: "",
      queryName: "",
      databaseSource: "",
      querySaved: false
    };

    this.onEditorChange = this.onEditorChange.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onEditorChange(e) {
    this.setState({ query: e });
  }

  componentDidMount() {
    console.log("did mount");
    const { organization_slug } = this.props.organization_slug;
    const { project_id } = this.props.project_id;
    const { projectDetail } = this.props.projectDetail;
    const { query_id } = this.props.query_id;

    if (isEmpty(projectDetail)) {
      this.props.getProjectDetail(organization_slug, project_id);
    }
    const { databases } = this.props.database;
    if (isEmpty(databases)) {
      this.props.getDatabaseSourceList(organization_slug);
    }
    // always get the fresh data from database
    this.props.getQuery(organization_slug, project_id, query_id);
  }

  componentWillReceiveProps(nextProps) {
    if (!isEmpty(nextProps.database.query)) {
      const { query } = nextProps.database;
      this.setState({
        query: isEmpty(query.query_text) ? "" : query.query_text,
        queryName: query.name,
        databaseSource: isEmpty(query.parent_database_source)
          ? ""
          : query.parent_database_source,
        querySaved: !!query.saved
      });
    }
  }

  getDatabaseSources() {
    const { databases } = this.props.database;
    let items = [];
    for (let i = 0; i < databases.length; i++) {
      items.push(
        <option key={databases[i].id} value={databases[i].id}>
          {databases[i].name}
        </option>
      );
    }

    return items;
  }

  executeQuery() {
    const sqlQuery = this.state.query;
    let databaseId = this.state.databaseSource;
    if (this.state.databaseSource === "") {
      const { databases } = this.props.database;
      if (databases.length > 0) {
        this.setState({ databaseSource: databases[0].id });
        databaseId = databases[0].id;
      }
    }
    const queryName = this.state.queryName;
    const queryData = {
      name: queryName,
      parent_database_source: databaseId,
      query_text: sqlQuery
    };
    const { organization_slug } = this.props.organization_slug;
    const { project_id } = this.props.project_id;
    const { query_id } = this.props.query_id;

    this.props.executeQuery(organization_slug, project_id, query_id, queryData);
  }
  saveQuery(queryId) {
    const { organization } = this.props.auth;
    const { projectDetail } = this.props.projectDetail;
    const newQuery = {
      saved: true,
      query_text: this.state.query,
      name: this.state.queryName,
      parent_database_source_id: this.state.databaseSource
    };
    this.props.updateQuery(
      organization.slug,
      projectDetail.id,
      queryId,
      newQuery
    );
  }

  render() {
    const { organization_slug } = this.props.organization_slug;
    const { project_id } = this.props.project_id;
    const { query, queryResult, executing } = this.props.database;

    return (
      <div className="container-fluid">
        <h3>
          <i className="fa fa-pencil-square-o" aria-hidden="true" /> Query
          editor
        </h3>
        <hr />
        <Row>
          <Col sm={9}>
            <AceEditor
              mode="mysql"
              theme="textmate"
              name="query"
              focus={true}
              width="100%"
              height="200px"
              onChange={this.onEditorChange}
              fontSize={14}
              showPrintMargin={false}
              showGutter={true}
              highlightActiveLine={true}
              value={this.state.query}
              enableBasicAutocompletion={true}
              enableLiveAutocompletion={true}
              editorProps={{ $blockScrolling: Infinity }}
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: false,
                showLineNumbers: true,
                tabSize: 2
              }}
            />
          </Col>
          <Col sm={3}>
            <Label>Query name</Label>
            <Input
              name="queryName"
              id="queryName"
              value={this.state.queryName}
              onChange={this.onChange}
            />
            <Label>Database source</Label>
            <Input
              type="select"
              name="databaseSource"
              id="databaseSource"
              value={this.state.databaseSource}
              onChange={this.onChange}
            >
              {this.getDatabaseSources()}
            </Input>
            <br />
            {!this.state.querySaved && (
              <Button
                color="primary"
                style={{ width: "49%" }}
                onClick={this.saveQuery.bind(this, query.id)}
              >
                <i className="fa fa-save" aria-hidden="true" /> Save
              </Button>
            )}{" "}
            <Button
              color="success"
              style={{ width: "49%" }}
              onClick={this.executeQuery.bind(this)}
            >
              <i className="fa fa-play" aria-hidden="true" /> Execute
            </Button>
            <span className="badge badge-light">Status:</span>
            <span
              className={classnames(
                "badge",
                { "badge-success": query.status === "done" },
                { "badge-info": query.status === "progress" },
                { "badge-danger": query.status === "error" }
              )}
            >
              {query.status}
            </span>
          </Col>
        </Row>
        <hr />

        <DataFramePreviewComponent data={queryResult} executing={executing} />
        <hr />
        <Link
          to={"/" + organization_slug + "/project/" + project_id + "/queries"}
        >
          <i className="fa fa-long-arrow-left" aria-hidden="true" /> Back
        </Link>
      </div>
    );
  }
}

QueryEditor.propTypes = {
  projectDetail: PropTypes.object.isRequired,
  getProjectDetail: PropTypes.func.isRequired,

  organization_slug: PropTypes.object.isRequired,
  project_id: PropTypes.object.isRequired,

  database: PropTypes.object.isRequired,
  createQuery: PropTypes.func.isRequired,
  getQuery: PropTypes.func.isRequired,

  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  projectDetail: state.projectDetail,
  organization_slug: ownProps.match.params,
  project_id: ownProps.match.params,
  query_id: ownProps.match.params,
  database: state.database,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {
    getProjectDetail,
    getDatabaseSourceList,
    createQuery,
    getQuery,
    updateQuery,
    executeQuery,
    showModal,
    hideModal
  }
)(withRouter(QueryEditor));
