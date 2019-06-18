import React from "react";
import { connect } from "react-redux";

//import AlertModal from "./AlertModal";

import CreateProjectModal from "./createProject/CreateProjectModal";
import UploadFileModal from "./uploadFile/UploadFileModal";
import ColumnsSelectionModal from "./columnsSelection/ColumnsSelectionModal";
import CreateExperimentModal from "./createExperiment/CreateExperimentModal";
import ComputePredictionModal from "./computePrediction/ComputePredictionModal";
import NewDatabaseSourceModal from "./newDatabaseSource/NewDatabaseSourceModal";

const MODAL_TYPES = {
  createProject: CreateProjectModal,
  uploadFile: UploadFileModal,
  columnsSelection: ColumnsSelectionModal,
  createExperiment: CreateExperimentModal,
  computePrediction: ComputePredictionModal,
  addDatabaseSource: NewDatabaseSourceModal
};

const mapStateToProps = state => ({
  ...state.modal
});

class ModalContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false
    };
    this.closeModal = this.closeModal.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props) {
      this.setState({
        modalIsOpen: nextProps.modalProps.open
      });
    }
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  render() {
    //console.log("model root render" + this.props.modalType);
    if (!this.props.modalType) {
      return null;
    }
    const SpecifiedModal = MODAL_TYPES[this.props.modalType];
    //console.log(this.state.modalIsOpen);
    return (
      <div>
        <SpecifiedModal
          closeModal={this.closeModal}
          {...this.props.modalProps}
        />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  null
)(ModalContainer);
