import React, { Component } from "react";
//import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Route, Switch } from "react-router";
import axios from "axios";

import Root from "./Root";
import NavbarMain from "./components/layout/NavbarMain.js";
import FooterMain from "./components/layout/FooterMain.js";
import NotFoundView from "./components/common/NotFound.js";
import Home from "./components/Home";
import Login from "./components/auth/Login";
import LogoutView from "./components/auth/Logout.js";
import ProjectList from "./components/projectList/ProjectList";
import ProjectDetail from "./components/projects/ProjectDetail.js";

import FileUploadList from "./components/fileUploadList/FileUploadList";

import DataFrameList from "./components/dataFrameList/dataFrameList";
import DataFramePreview from "./components/dataFramePreview/dataFramePreview";

import ExperimentList from "./components/experiment/ExperimentList";
import MLModelList from "./components/mlmodel/MLModelList";
import ColumnsUsageList from "./components/columnsUsage/ColumnsUsageList";
import PredictionList from "./components/prediction/PredictionList";
import QueryList from "./components/dbSource/QueryList";
import QueryEditor from "./components/dbSource/QueryEditor";

import requireAuthentication from "./utils/requireAuthentication";
import ModalRoot from "./components/modals/ModalRoot";
import "./App.css";
import { ToastContainer } from "react-toastify";
import LayoutWithLeftNavbar from "./components/layout/LayoutWithLeftNavbar";
import WebSocketContainer from "./components/websocketContainer/WebSocketContainer";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

class App extends Component {
  render() {
    return (
      <Root>
        <div className="App">
          <NavbarMain />
          <ModalRoot />
          <ToastContainer />
          <div style={{ padding: "0px" }}>
            <Switch>
              <Route path="/login" component={Login} />
              <Route path="/logout" component={LogoutView} />

              <Route exact path="/" component={Home} />
              <Route
                exact
                path="/:organization_slug/projects/"
                component={requireAuthentication(ProjectList)}
              />
              <LayoutWithLeftNavbar>
                <WebSocketContainer autoconnect={true}>
                  <Route
                    exact
                    path="/:organization_slug/project/:id/"
                    component={requireAuthentication(ProjectDetail)}
                  />

                  <Route
                    path="/:organization_slug/project/:project_id/uploaded/"
                    component={requireAuthentication(FileUploadList)}
                  />

                  <Route
                    path="/:organization_slug/project/:project_id/dataframes/"
                    component={requireAuthentication(DataFrameList)}
                  />

                  <Route
                    path="/:organization_slug/project/:project_id/columns_usage_list/"
                    component={requireAuthentication(ColumnsUsageList)}
                  />

                  <Route
                    path="/:organization_slug/project/:project_id/dataframe_preview/:dataframe_id/"
                    component={requireAuthentication(DataFramePreview)}
                  />

                  <Route
                    path="/:organization_slug/project/:project_id/experiments/"
                    component={requireAuthentication(ExperimentList)}
                  />

                  <Route
                    path="/:organization_slug/project/:project_id/models/"
                    component={requireAuthentication(MLModelList)}
                  />

                  <Route
                    path="/:organization_slug/project/:project_id/predictions/"
                    component={requireAuthentication(PredictionList)}
                  />
                  <Route
                    path="/:organization_slug/project/:project_id/queries/"
                    component={requireAuthentication(QueryList)}
                  />

                  <Route
                    path="/:organization_slug/project/:project_id/query_editor/:query_id/"
                    component={requireAuthentication(QueryEditor)}
                  />
                </WebSocketContainer>
              </LayoutWithLeftNavbar>

              <Route path="*" component={NotFoundView} />
            </Switch>
          </div>
          <FooterMain />
        </div>
      </Root>
    );
  }
}

export default App;
