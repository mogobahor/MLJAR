import {
  WEBSOCKET_CONNECT,
  WEBSOCKET_CONNECTING,
  WEBSOCKET_CONNECTED,
  //WS_DISCONNECT,
  WEBSOCKET_DISCONNECTED,
  WEBSOCKET_MESSAGE
} from "./WebSocketTypes";

const initialState = {
  host: null,
  status: "disconnected"
};

function webSocketReducer(state = initialState, action) {
  switch (action.type) {
    case WEBSOCKET_CONNECT:
      return {
        ...state,
        host: action.host,
        status: "connect"
      };
    case WEBSOCKET_CONNECTING:
      return {
        ...state,
        host: action.host,
        status: "connecting"
      };
    case WEBSOCKET_CONNECTED:
      return {
        ...state,
        host: action.host,
        status: "connected"
      };
    case WEBSOCKET_DISCONNECTED:
      return {
        ...state,
        host: action.host,
        status: "disconnected"
      };
    case WEBSOCKET_MESSAGE:
      //console.log(action.host);
      //console.log(action.payload);

      return {
        state
      };
    default:
      return state;
  }
}

export default webSocketReducer;
