import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Form, FormGroup, Label, Input } from "reactstrap";
import { computePrediction } from "./ComputePredictionActions";
import { getDataFrames } from "../../dataFrameList/dataFrameListActions";
import { getMLModels } from "../../mlmodel/MLModelActions";
import isEmpty from "../../../validation/isEmpty";

class ComputePredictionModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShow: true,
      inputData: "",
      mlmodel: "",
      errorMessage: ""
    };
    this.onExit = this.onExit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.submitComputePrediction = this.submitComputePrediction.bind(this);
  }

  componentDidMount() {
    const { dataframes } = this.props.dataFrameList;
    if (isEmpty(dataframes)) {
      const { organization } = this.props.auth;
      const { projectDetail } = this.props.projectDetail;
      this.props.getDataFrames(organization.slug, projectDetail.id);
    }
    const { mlmodels } = this.props.mlmodel;
    if (isEmpty(mlmodels)) {
      const { organization } = this.props.auth;
      const { projectDetail } = this.props.projectDetail;
      this.props.getMLModels(organization.slug, projectDetail.id);
    }
  }

  createDataFrameItems() {
    const { dataframes } = this.props.dataFrameList;
    let items = [];
    for (let i = 0; i < dataframes.length; i++) {
      items.push(
        <option key={dataframes[i].id} value={dataframes[i].id}>
          {dataframes[i].source_title}
        </option>
      );
    }
    items.unshift(
      <option value="" disabled key={"disbale-0"}>
        Please select an input data source
      </option>
    );
    return items;
  }

  createMLModelItems() {
    const { mlmodels } = this.props.mlmodel;

    let items = [];
    for (let i = 0; i < mlmodels.length; i++) {
      items.push(
        <option key={mlmodels[i].id} value={mlmodels[i].id}>
          Model id: {mlmodels[i].id}
        </option>
      );
    }
    items.unshift(
      <option value="" disabled key={"disbale-0"}>
        Please select the ML model
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

  onExit() {}

  submitComputePrediction() {
    console.log("submitComputePrediction");

    console.log(this.state.inputData);
    console.log(this.state.mlmodel);

    if (isEmpty(this.state.inputData)) {
      this.setState({
        errorMessage: "Please select input data"
      });
      return;
    }
    if (isEmpty(this.state.mlmodel)) {
      this.setState({
        errorMessage: "Please select model for computing predictions"
      });
      return;
    }

    const newPredictions = {
      parent_dataframe: this.state.inputData,
      parent_mlmodel: this.state.mlmodel
    };
    console.log("newPredictions");
    console.log(newPredictions);
    const { organization } = this.props.auth;
    const { projectDetail } = this.props.projectDetail;

    this.props.computePrediction(
      organization.slug,
      projectDetail.id,
      newPredictions,
      this.props.closeModal
    );
  }

  render() {
    return (
      <Modal
        isOpen={true}
        onExit={this.onExit}
        toggle={this.props.closeModal}
        size={"md"}
      >
        <ModalHeader>
          <i className="fa fa-bolt" aria-hidden="true" /> Compute Predictions
        </ModalHeader>
        <ModalBody>
          <div className="container">
            <Form>
              <FormGroup>
                <Label for="inputDataId">Input data</Label>
                <Input
                  type="select"
                  name="inputData"
                  id="inputDataId"
                  value={this.state.inputData}
                  onChange={this.onChange}
                >
                  {this.createDataFrameItems()}
                </Input>
              </FormGroup>

              <FormGroup>
                <Label for="mlmodelId">ML Model</Label>
                <Input
                  type="select"
                  name="mlmodel"
                  id="mlmodelId"
                  value={this.state.mlmodel}
                  onChange={this.onChange}
                >
                  {this.createMLModelItems()}
                </Input>
              </FormGroup>
            </Form>
          </div>
        </ModalBody>
        <ModalFooter>
          <p style={{ color: "red" }}>{this.state.errorMessage}</p>
          <Button color="secondary" onClick={this.props.closeModal} outline>
            Cancel
          </Button>
          <Button color="primary" onClick={this.submitComputePrediction}>
            Compute Predictions
          </Button>{" "}
        </ModalFooter>
      </Modal>
    );
  }
}

ComputePredictionModal.propTypes = {
  projectDetail: PropTypes.object.isRequired,

  dataFrameList: PropTypes.object.isRequired,
  getDataFrames: PropTypes.func.isRequired,
  getMLModels: PropTypes.func.isRequired,
  computePrediction: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  projectDetail: state.projectDetail,

  dataFrameList: state.dataFrameList,
  mlmodel: state.mlmodel,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getDataFrames, computePrediction, getMLModels }
)(withRouter(ComputePredictionModal));
