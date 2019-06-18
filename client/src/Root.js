import React from "react";
import { Provider } from "react-redux";

import { applyMiddleware, createStore } from "redux";
import { routerMiddleware } from "connected-react-router";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";

import setAxiosAuthToken from "./utils/setAxiosAuthToken";
import { setCurrentUser, setToken } from "./actions/authActions";

import rootReducer from "./reducers";

import { createBrowserHistory } from "history";

import { ConnectedRouter } from "connected-react-router";
import webSocketsMiddleware from "./components/websocketContainer/WebSocketMiddleware";

export default ({ children, initialState = {} }) => {
  const middleware = [thunk, webSocketsMiddleware];
  const history = createBrowserHistory();

  const store = createStore(
    rootReducer(history),
    initialState,
    composeWithDevTools(
      applyMiddleware(routerMiddleware(history), ...middleware)
    )
  );

  if (localStorage.token) {
    setAxiosAuthToken(localStorage.token);
    const user = JSON.parse(localStorage.getItem("user"));
    const organization = JSON.parse(localStorage.getItem("organization"));
    store.dispatch(setToken(localStorage.token));
    store.dispatch(setCurrentUser(user, organization, ""));
  }

  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>{children}</ConnectedRouter>
    </Provider>
  );
};
