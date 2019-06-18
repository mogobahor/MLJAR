import React, { Component } from "react";
import { connect } from "react-redux";
import { webSocketConnect, webSocketDisconnect } from "./WebSocketActions";
import PropTypes from "prop-types";

class WebSocketContainer extends Component {
  constructor(props) {
    super(props);
    this.autoconnect = !!props.autoconnect;
  }
  componentDidMount() {
    console.log("did mount");
    const { token, organization } = this.props.auth;
    const { status } = this.props.webSocket;
    let webSocketUrl =
      process.env.REACT_APP_WEBSOCKET_URL +
      "?token=" +
      token +
      "&organization=" +
      organization.slug;

    if (this.autoconnect && status !== "connected") {
      this.props.webSocketConnect(webSocketUrl);
    }
  }

  componentWillUnmount() {
    const { token, organization } = this.props.auth;
    //const { status } = this.props.webSocket;
    let webSocketUrl =
      process.env.REACT_APP_WEBSOCKET_URL +
      "?token=" +
      token +
      "&organization=" +
      organization.slug;

    this.props.webSocketDisconnect(webSocketUrl);
  }

  render() {
    return <div>{this.props.children}</div>;
  }
}

WebSocketContainer.propTypes = {
  auth: PropTypes.object.isRequired,
  webSocket: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  auth: state.auth,
  webSocket: state.webSocket
});

const mapDispatchToProps = { webSocketConnect, webSocketDisconnect };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WebSocketContainer);
