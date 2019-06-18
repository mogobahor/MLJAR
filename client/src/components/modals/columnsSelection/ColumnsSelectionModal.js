import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { FormGroup, Label, Input } from "reactstrap";
import { getDataFrames } from "../../dataFrameList/dataFrameListActions";
import {
  getDataFrameColumns,
  setColumnUsage
} from "./ColumnsSelectionModalActions";
import { addColumnsUsage } from "../../columnsUsage/ColumnsUsageActions";
import Select from "react-select";
import {
  AvForm,
  AvGroup,
  AvInput,
  //AvField,
  AvFeedback
} from "availity-reactstrap-validation";
import isEmpty from "../../../validation/isEmpty";

class ColumnsSelectionModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: true,
      errorMessage: "",
      selectedSource: "",
      title: "Select all"
    };
    this.onChange = this.onChange.bind(this);
    this.onCreate = this.onCreate.bind(this);
    this.onTargetColumnChange = this.onTargetColumnChange.bind(this);
    this.onInputColumnsChange = this.onInputColumnsChange.bind(this);
    this.onDoNotUseColumnsChange = this.onDoNotUseColumnsChange.bind(this);
    this.onSourceSelected = this.onSourceSelected.bind(this);
  }

  componentDidMount() {
    const { organization } = this.props.auth;
    const { projectDetail } = this.props.projectDetail;
    this.props.getDataFrames(organization.slug, projectDetail.id);
  }

  onCreate = () => {
    const { organization } = this.props.auth;
    const { projectDetail } = this.props.projectDetail;

    const {
      targetColumn,
      inputColumns,
      doNotUseColumns
    } = this.props.dataFrameColumns;
    if (isEmpty(targetColumn) || isEmpty(inputColumns)) {
      this.setState({
        errorMessage: "Please select target and input columns."
      });
      return;
    }
    if (isEmpty(this.state.title)) {
      this.setState({
        errorMessage: "Please provide title."
      });
      return;
    }

    let usageData = {
      target: targetColumn.map(col => col.label),
      input: inputColumns.map(col => col.label),
      dontUse: doNotUseColumns.map(col => col.label)
    };

    this.props.addColumnsUsage(
      organization.slug,
      projectDetail.id,
      {
        title: this.state.title,
        columns_usage: usageData,
        target_details: targetColumn[0]["column_details"]
      },
      this.props.closeModal
    );
  };

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
    this.setState({
      errorMessage: ""
    });
  }
  onTargetColumnChange(value) {
    if (!isEmpty(this.props.dataFrameColumns.targetColumn)) {
      this.props.setColumnUsage(
        this.props.dataFrameColumns.targetColumn[0].index,
        "input"
      );
    }
    this.props.setColumnUsage(value.index, "target");
    this.setState({
      errorMessage: ""
    });
  }
  onInputColumnsChange(values, eventDetails) {
    const { action } = eventDetails;
    if (action === "remove-value") {
      const { removedValue } = eventDetails;
      this.props.setColumnUsage(removedValue.index, "doNotUse");
    } else if (action === "select-option") {
      const { option } = eventDetails;
      this.props.setColumnUsage(option.index, "input");
    }
    this.setState({
      errorMessage: ""
    });
  }
  onDoNotUseColumnsChange(values, eventDetails) {
    const { action } = eventDetails;
    if (action === "remove-value") {
      const { removedValue } = eventDetails;
      this.props.setColumnUsage(removedValue.index, "input");
    } else if (action === "select-option") {
      const { option } = eventDetails;
      this.props.setColumnUsage(option.index, "doNotUse");
    }
    this.setState({
      errorMessage: ""
    });
  }

  onSourceSelected(e) {
    const organization_slug = this.props.auth.organization.slug;
    const project_id = this.props.projectDetail.projectDetail.id;
    const datasource_id = this.state.selectedSource;

    if (!isEmpty(datasource_id)) {
      this.props.getDataFrameColumns(
        organization_slug,
        project_id,
        datasource_id
      );
    }
    this.setState({
      errorMessage: ""
    });
  }

  getTemplateDataFrame = dataframes => {
    let templateDF = <div>No data sources available </div>;
    if (!isEmpty(dataframes)) {
      let options = dataframes.map((df, index) => {
        return (
          <option value={df.id} key={"option-" + df.id}>
            {df.name}{" "}
          </option>
        );
      });
      options.unshift(
        <option value="" disabled key={"disbale-0"}>
          Please select a data source
        </option>
      );

      templateDF = (
        <FormGroup>
          <Label for="sourceSelect">Column usage based on data source</Label>
          <Input
            type="select"
            name="selectedSource"
            id="sourceSelect"
            value={this.state.selectedSource}
            onChange={this.onChange}
            onClick={this.onSourceSelected}
          >
            {options}
          </Input>
        </FormGroup>
      );
    }
    return templateDF;
  };

  render() {
    const { dataframes } = this.props.dataFrameList;
    const {
      columns,
      targetColumn,
      inputColumns,
      doNotUseColumns
    } = this.props.dataFrameColumns;

    let selectBaseDataFrame = this.getTemplateDataFrame(dataframes);

    return (
      <Modal
        isOpen={true}
        toggle={this.props.closeModal}
        size={"lg"}
        autoFocus={false}
      >
        <ModalHeader>
          {" "}
          <i className="fa fa-list-ul" aria-hidden="true" /> Select columns for
          ML experiment
        </ModalHeader>

        <AvForm>
          {isEmpty(dataframes) && (
            <ModalBody>
              {" "}
              Please add data source to the project before selecting columns
            </ModalBody>
          )}
          {!isEmpty(dataframes) && (
            <ModalBody>
              <AvGroup>
                <Label for="dfTitle">Title</Label>
                <AvInput
                  type="text"
                  name="title"
                  value={this.state.title}
                  id="dfTitle"
                  placeholder="Name of your columns selection"
                  autoFocus={true}
                  onChange={this.onChange}
                  required
                />
                <AvFeedback>Title is required</AvFeedback>
              </AvGroup>

              {selectBaseDataFrame}

              {!isEmpty(columns) && (
                <div>
                  <AvGroup>
                    <Label for="targetSelect">
                      Target column{" "}
                      <small>
                        (Only one column can be selected as target column)
                      </small>
                    </Label>
                    <Select
                      id="targetSelect"
                      options={columns}
                      value={targetColumn}
                      onChange={this.onTargetColumnChange}
                    />
                  </AvGroup>

                  <AvGroup>
                    <Label for="targetSelect">
                      Input columns
                      {!isEmpty(inputColumns) && (
                        <small> (# of columns: {inputColumns.length}) </small>
                      )}
                    </Label>
                    <Select
                      isMulti
                      id="targetSelect"
                      options={columns}
                      value={inputColumns}
                      onChange={this.onInputColumnsChange}
                    />
                  </AvGroup>

                  <AvGroup>
                    <Label for="targetSelect">
                      Do not use columns
                      {!isEmpty(doNotUseColumns) && (
                        <small>
                          {" "}
                          (# of columns: {doNotUseColumns.length}){" "}
                        </small>
                      )}
                    </Label>
                    <Select
                      isMulti
                      id="targetSelect"
                      options={columns}
                      value={doNotUseColumns}
                      onChange={this.onDoNotUseColumnsChange}
                    />
                  </AvGroup>
                </div>
              )}
            </ModalBody>
          )}
          <ModalFooter>
            <p style={{ color: "red" }}>{this.state.errorMessage}</p>
            <Button outline color="secondary" onClick={this.props.closeModal}>
              Cancel
            </Button>

            <Button color="primary" onClick={this.onCreate}>
              Create
            </Button>
          </ModalFooter>
        </AvForm>
      </Modal>
    );
  }
}

ColumnsSelectionModal.propTypes = {
  auth: PropTypes.object.isRequired,
  projectDetail: PropTypes.object.isRequired,
  getDataFrames: PropTypes.func.isRequired,
  dataFrameList: PropTypes.object.isRequired,
  getDataFrameColumns: PropTypes.func.isRequired,
  dataFrameColumns: PropTypes.object.isRequired,
  setColumnUsage: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  auth: state.auth,
  projectDetail: state.projectDetail,
  dataFrameList: state.dataFrameList,
  dataFrameColumns: state.dataFrameColumns
});

export default connect(
  mapStateToProps,
  { getDataFrames, getDataFrameColumns, setColumnUsage, addColumnsUsage }
)(withRouter(ColumnsSelectionModal));
