import * as webSocketsActions from "./WebSocketActions";
import { WEBSOCKET_CONNECT, WEBSOCKET_DISCONNECT } from "./WebSocketTypes";
import { UPDATE_QUERY_TASK } from "../dbSource/DatabaseSourceTypes";

const webSocketsMiddleware = (function() {
  let socket = null;

  /**
   * Handler for when the WebSocket opens
   */
  const onOpen = (ws, store, host) => event => {
    store.dispatch(webSocketsActions.webSocketConnected(host));
  };

  /**
   * Handler for when the WebSocket closes
   */
  const onClose = (ws, store, host) => event => {
    console.log("onClose");
    store.dispatch(webSocketsActions.webSocketDisconnected(host));
    //console.log(
    //  "Socket is closed. Reconnect will be attempted in 5 second.",
    //  event.reason
    //);
    //setTimeout(() => {
    //  console.log("timeout");
    //  store.dispatch(webSocketsActions.webSocketConnect(host));
    //}, 5000);
  };

  /**
   * Handler for when a message has been received from the server.
   */
  const onMessage = (ws, store) => event => {
    const payload = JSON.parse(event.data);
    store.dispatch(webSocketsActions.webSocketMessage(event.host, payload));
    console.log("on message");
    console.log(payload.data);

    let msg = {
      type: UPDATE_QUERY_TASK,
      db_id: payload.data.db_id,
      status: payload.data.status
    };
    if (payload.data.hasOwnProperty("result")) {
      msg["result"] = JSON.parse(payload.data.result);
    }

    store.dispatch(msg);
  };

  /**
   * Middleware
   */
  return store => next => action => {
    switch (action.type) {
      case WEBSOCKET_CONNECT:
        if (socket !== null) {
          socket.close();
        }

        // Pass action along
        next(action);

        // Tell the store that we're busy connecting...
        store.dispatch(webSocketsActions.webSocketConnecting(action.host));

        // Attempt to connect to the remote host...
        console.log("store, attempt to connect");
        socket = new WebSocket(action.host);

        // Set up WebSocket handlers
        socket.onmessage = onMessage(socket, store);
        socket.onclose = onClose(socket, store, action.host);
        socket.onopen = onOpen(socket, store, action.host);

        break;

      case WEBSOCKET_DISCONNECT:
        if (socket !== null) {
          socket.close();
        }
        socket = null;

        // Tell the store that we've been disconnected...
        store.dispatch(webSocketsActions.webSocketDisconnected(action.host));

        break;

      default:
        return next(action);
    }
  };
})();

export default webSocketsMiddleware;
