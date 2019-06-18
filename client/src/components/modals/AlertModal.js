import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

class AlertModal extends React.Component {
  // = ({ closeModal, title, message }) => {

  constructor(props) {
    console.log("alertmodal constructor");
    super(props);
    console.log(props);
    this.state = {
      isShow: true //props.open
    };
    this.onExist = this.onExit.bind(this);
  }

  onExit() {
    console.log("on exit");
  }
  render() {
    console.log("alertmodal itself" + this.props.open + this.state.isShow);
    //this.setState({ isShow: this.props.open });

    return (
      <Modal isOpen={true} onExit={this.onExit} toggle={this.props.closeModal}>
        <ModalHeader>Modal title</ModalHeader>
        <ModalBody>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.props.closeModal}>
            Do Something
          </Button>{" "}
          <Button color="secondary" onClick={this.props.closeModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default AlertModal;
