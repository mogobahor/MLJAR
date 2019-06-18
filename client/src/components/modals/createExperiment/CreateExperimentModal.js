import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Form, FormGroup, Label, Input } from "reactstrap";
import { createExperiment } from "./CreateExperimentActions";
import { getDataFrames } from "../../dataFrameList/dataFrameListActions";
import { getColumnsUsageList } from "../../columnsUsage/ColumnsUsageActions";
import isEmpty from "../../../validation/isEmpty";

class CreateExperimentModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShow: true,
      title: "ML Experiment",
      trainingData: "",
      validationData: "",
      description: "",
      validationType: "kfold",
      kFolds: "5",
      trainSplit: "0.8",
      shuffle: true,
      stratify: true,
      columnsUsage: "",
      errorMessage: "",
      mlTask: "binary_classification",
      metric: "logloss",
      timeConstraint: "5",
      tuningMode: "normal"
    };
    this.onExit = this.onExit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.submitCreateExperiment = this.submitCreateExperiment.bind(this);
  }

  componentDidMount() {
    const { dataframes } = this.props.dataFrameList;
    if (isEmpty(dataframes)) {
      const { organization } = this.props.auth;
      const { projectDetail } = this.props.projectDetail;
      this.props.getDataFrames(organization.slug, projectDetail.id);
    }
    const { columnsUsageList } = this.props.columnsUsage;
    if (isEmpty(columnsUsageList)) {
      const { organization } = this.props.auth;
      const { projectDetail } = this.props.projectDetail;
      this.props.getColumnsUsageList(organization.slug, projectDetail.id);
    }
  }

  createDataFrameItems() {
    const { dataframes } = this.props.dataFrameList;
    let items = [];
    for (let i = 0; i < dataframes.length; i++) {
      items.push(
        <option key={dataframes[i].id} value={dataframes[i].id}>
          {dataframes[i].name}
        </option>
      );
    }
    items.unshift(
      <option value="" disabled key={"disbale-0"}>
        Please select a data source
      </option>
    );
    return items;
  }

  createColumnUsageItems() {
    const { columnsUsageList } = this.props.columnsUsage;

    let items = [];
    for (let i = 0; i < columnsUsageList.length; i++) {
      items.push(
        <option
          key={columnsUsageList[i].id}
          value={JSON.stringify(columnsUsageList[i])}
        >
          {columnsUsageList[i].title}, {columnsUsageList[i].input_cnt} inputs,{" "}
          {columnsUsageList[i].target_name} as target
        </option>
      );
    }
    items.unshift(
      <option value="" disabled key={"disbale-0"}>
        Please select a columns usage
      </option>
    );
    return items;
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
    this.setState({
      errorMessage: ""
    });
  }

  onChangeMLTask(e) {
    this.onChange(e);

    if (e.target.value === "binary_classification") {
      this.setState({ metric: "logloss" });
    }
    if (e.target.value === "multiclass_classification") {
      this.setState({ metric: "logloss" });
    }
    if (e.target.value === "regression") {
      this.setState({ metric: "mean square error" });
    }
  }

  onColumnsUsageChange(e) {
    this.onChange(e);
    let cols = JSON.parse(e.target.value);
    if (cols.target_details.unique_values === 2) {
      console.log("Binary classification");
      this.setState({ mlTask: "binary_classification" });
      this.setState({ metric: "logloss" });
    } else if (cols.target_details.unique_values <= 10) {
      console.log("Multiclass");
      this.setState({ mlTask: "multiclass_classification" });
      this.setState({ metric: "logloss" });
    } else {
      console.log("Regression");
      this.setState({ mlTask: "regression" });
      this.setState({ metric: "mean square error" });
    }
    console.log("onColumnsUsageChange");
    console.log(e.target.name + " " + e.target.value);
    console.log(JSON.parse(e.target.value));
  }

  onStratifyChange(e) {
    this.setState({
      stratify: !this.state.stratify
    });
  }
  onShuffleChange(e) {
    this.setState({
      shuffle: !this.state.shuffle
    });
  }
  onExit() {}

  submitCreateExperiment() {
    console.log("submitCreateExperiment");

    console.log(this.state);

    if (isEmpty(this.state.title)) {
      this.setState({
        errorMessage: "Please provide title of your ML experiment"
      });
      return;
    }
    if (isEmpty(this.state.trainingData)) {
      this.setState({
        errorMessage: "Please select input data for your ML experiment"
      });
      return;
    }
    if (isEmpty(this.state.columnsUsage)) {
      this.setState({
        errorMessage: "Please select columns usage for your ML experiment"
      });
      return;
    }

    let validationParams = { validation_type: this.state.validationType };
    if (this.state.validationType === "kfold") {
      validationParams = {
        validation_type: this.state.validationType,
        k_folds: this.state.kFolds,
        shuffle: this.state.shuffle,
        stratify: this.state.stratify
      };
    } else if (this.state.validationType === "split") {
      validationParams = {
        validation_type: this.state.validationType,
        train_split: this.state.trainSplit,
        shuffle: this.state.shuffle,
        stratify: this.state.stratify
      };
    }
    console.log("validationParams");
    console.log(validationParams);

    const params = {
      training_data_id: this.state.trainingData,
      metric: { optimize: "logloss", monitor: ["logloss"] },
      validation: validationParams,
      preprocessing: {}
    };
    const newExperiment = {
      title: this.state.title,
      description: this.state.description,
      params: params,
      parent_columns_usage: this.state.columnsUsage,
      parent_training_dataframe: this.state.trainingData
      //"parent_validation_dataframe",
    };
    console.log("newExperiment");
    console.log(newExperiment);
    const { organization } = this.props.auth;
    const { projectDetail } = this.props.projectDetail;
    /*
    this.props.createExperiment(
      organization.slug,
      projectDetail.id,
      newExperiment,
      this.props.closeModal
  );*/
  }

  render() {
    let modalWidth =
      parseInt(Math.min(Math.max(window.innerWidth * 0.8, 800), 1500)) + "px";

    return (
      <Modal
        isOpen={true}
        onExit={this.onExit}
        toggle={this.props.closeModal}
        style={{ maxWidth: modalWidth }}
      >
        <ModalHeader>
          <i className="fa fa-flask" aria-hidden="true" /> Create Machine
          Learning Experiment
        </ModalHeader>
        <ModalBody>
          <div className="container-fluid">
            <Form>
              <div className="row">
                <div className="col-6">
                  <FormGroup>
                    <Label for="title">Experiment title</Label>
                    <Input
                      type="text"
                      name="title"
                      id="title"
                      value={this.state.title}
                      onChange={this.onChange}
                    />
                  </FormGroup>

                  <div className="row">
                    <div className="col-6">
                      <Label for="validationTypeId">Validation type</Label>
                      <Input
                        type="select"
                        name="validationType"
                        id="validationType"
                        value={this.state.validationType}
                        onChange={this.onChange}
                      >
                        <option key={"kfold"} value={"kfold"}>
                          k-fold validation
                        </option>

                        <option key={"split"} value={"split"}>
                          Train/validation split
                        </option>
                        <option key={"with_dataset"} value={"with_dataset"}>
                          With dataset
                        </option>
                      </Input>

                      {this.state.validationType !== "with_dataset" && (
                        <FormGroup check style={{ padding: "17px" }}>
                          <Label check>
                            <Input
                              type="checkbox"
                              name="shuffle"
                              checked={this.state.shuffle}
                              onChange={this.onShuffleChange.bind(this)}
                            />{" "}
                            Shuffle samples
                          </Label>
                        </FormGroup>
                      )}
                    </div>
                    <div className="col-6">
                      {this.state.validationType === "kfold" && (
                        <div>
                          <Label for="kFoldsId">Folds</Label>
                          <Input
                            type="number"
                            name="kFolds"
                            id="kFoldsId"
                            value={this.state.kFolds}
                            onChange={this.onChange}
                            min={2}
                            max={30}
                          />
                        </div>
                      )}
                      {this.state.validationType === "split" && (
                        <div>
                          <Label for="trainSplitId">
                            Train/validation split
                          </Label>
                          <Input
                            type="select"
                            name="trainSplit"
                            id="trainSplitId"
                            value={this.state.trainSplit}
                            onChange={this.onChange}
                          >
                            <option key={"split0.5"} value={"0.5"}>
                              50% train / 50% validation
                            </option>
                            <option key={"split0.6"} value={"0.6"}>
                              60% train / 40% validation
                            </option>
                            <option key={"split0.7"} value={"0.7"}>
                              70% train / 30% validation
                            </option>
                            <option key={"split0.8"} value={"0.8"}>
                              80% train / 20% validation
                            </option>
                            <option key={"split0.9"} value={"0.9"}>
                              90% train / 10% validation
                            </option>
                          </Input>
                        </div>
                      )}

                      {this.state.mlTask !== "regression" &&
                        this.state.validationType !== "with_dataset" && (
                          <FormGroup check style={{ padding: "17px" }}>
                            <Label check>
                              <Input
                                type="checkbox"
                                name="stratify"
                                checked={this.state.stratify}
                                onChange={this.onStratifyChange.bind(this)}
                              />{" "}
                              Stratify classes in folds
                            </Label>
                          </FormGroup>
                        )}
                    </div>
                  </div>
                </div>

                <div className="col-6">
                  <FormGroup>
                    <Label for="description">Description</Label>
                    <Input
                      type="textarea"
                      rows={5}
                      name="description"
                      value={this.state.description}
                      id="description"
                      onChange={this.onChange}
                      placeholder="Optional description of experiment"
                    />
                  </FormGroup>
                </div>
              </div>
              <div className="row">
                <div className="col-4">
                  <FormGroup>
                    <h5>
                      <b>Training data</b>
                    </h5>
                    <Input
                      type="select"
                      name="trainingData"
                      id="trainingData"
                      value={this.state.trainingData}
                      onChange={this.onChange}
                    >
                      {this.createDataFrameItems()}
                    </Input>
                  </FormGroup>

                  {this.state.validationType === "with_dataset" && (
                    <FormGroup>
                      <h5>
                        <b>Validation data</b>
                      </h5>
                      <Input
                        type="select"
                        name="validationData"
                        id="validationDataId"
                        value={this.state.validationData}
                        onChange={this.onChange}
                      >
                        {this.createDataFrameItems()}
                      </Input>
                    </FormGroup>
                  )}

                  <FormGroup>
                    <Label for="columnsUsageId">Columns selection</Label>
                    <Input
                      type="select"
                      name="columnsUsage"
                      id="columnsUsageId"
                      value={this.state.columnsUsage}
                      onChange={this.onColumnsUsageChange.bind(this)}
                    >
                      {this.createColumnUsageItems()}
                    </Input>
                  </FormGroup>
                </div>

                <div className="col-4">
                  <h5>
                    <b> Algorithms </b>
                  </h5>
                  <FormGroup check>
                    <Label check>
                      <Input type="checkbox" checked disabled /> Extreme
                      Gradient Boosting
                    </Label>
                  </FormGroup>
                  <FormGroup check>
                    <Label check>
                      <Input type="checkbox" checked disabled /> Random Forest
                    </Label>
                  </FormGroup>
                </div>

                <div className="col-4">
                  <h5>
                    <b> Tunning details </b>
                  </h5>
                  <div>
                    <Label for="mlTaskId">Machine Learning Task</Label>
                    <Input
                      type="select"
                      name="mlTask"
                      id="mlTaskId"
                      value={this.state.mlTask}
                      onChange={this.onChangeMLTask.bind(this)}
                    >
                      <option key={"bin_class"} value={"binary_classification"}>
                        Binary classification
                      </option>
                      <option
                        key={"multi_class"}
                        value={"multiclass_classification"}
                      >
                        Multiclass classification
                      </option>
                      <option key={"regression"} value={"regression"}>
                        Regression
                      </option>
                    </Input>
                    {this.state.metric && (
                      <b>Metric that will be optimized: {this.state.metric}</b>
                    )}
                  </div>

                  <FormGroup>
                    <Label for="tuningModeId">Tuning mode</Label>
                    <Input
                      type="select"
                      name="tuningMode"
                      value={this.state.tuningMode}
                      onChange={this.onChange}
                      id="tuningModeId"
                    >
                      <option key={"tuneNormal"} value={"normal"}>
                        Normal (about 10 models per algorithm)
                      </option>
                      <option key={"tuneSport"} value={"sport"}>
                        Sport (about 20 models per algorithm)
                      </option>
                    </Input>
                  </FormGroup>

                  <FormGroup>
                    <Label for="timeConstraintId">Time constraint</Label>
                    <Input
                      type="select"
                      name="timeConstraint"
                      value={this.state.timeConstraint}
                      onChange={this.onChange}
                      id="timeConstraintId"
                    >
                      <option key={"keyTime1"} value={"1"}>
                        1 minute
                      </option>
                      <option key={"keyTime5"} value={"5"}>
                        5 minutes
                      </option>
                      <option key={"keyTime10"} value={"10"}>
                        10 minutes
                      </option>
                      <option key={"keyTime20"} value={"20"}>
                        20 minutes
                      </option>
                      <option key={"keyTime30"} value={"30"}>
                        30 minutes
                      </option>
                      <option key={"keyTime60"} value={"60"}>
                        60 minutes
                      </option>
                    </Input>
                  </FormGroup>
                </div>
              </div>
            </Form>
          </div>
        </ModalBody>
        <ModalFooter>
          <p style={{ color: "red" }}>{this.state.errorMessage}</p>
          <Button color="secondary" onClick={this.props.closeModal} outline>
            Cancel
          </Button>
          <Button color="primary" onClick={this.submitCreateExperiment}>
            Start ML Experiment
          </Button>{" "}
        </ModalFooter>
      </Modal>
    );
  }
}

CreateExperimentModal.propTypes = {
  projectDetail: PropTypes.object.isRequired,

  dataFrameList: PropTypes.object.isRequired,
  getDataFrames: PropTypes.func.isRequired,
  columnsUsage: PropTypes.object.isRequired,
  getColumnsUsageList: PropTypes.func.isRequired,
  createExperiment: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  projectDetail: state.projectDetail,

  dataFrameList: state.dataFrameList,
  columnsUsage: state.columnsUsage,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getDataFrames, createExperiment, getColumnsUsageList }
)(withRouter(CreateExperimentModal));
