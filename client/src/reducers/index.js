import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import authReducer from "./authReducer";
import errorsReducer from "./errorsReducer";

import projectDetailReducer from "./projectDetailReducer";
import fileUploadReducer from "../components/modals/uploadFile/UploadFileModalReducer";

import fileUploadListReducer from "../components/fileUploadList/FileUploadListReducer";
import columnsUsageReducer from "../components/columnsUsage/ColumnsUsageReducer";
//import datasourcesReducer from "./datasourcesReducer";
import databaseReducer from "../components/dbSource/DatabaseSourceReducer";
import dataFrameColumnsReducer from "../components/modals/columnsSelection/ColumnsSelectionModalReducer";

import dataFrameListReducer from "../components/dataFrameList/dataFrameListReducer";
import dataFramePreviewReducer from "../components/dataFramePreview/dataFramePreviewReducer";
import { experimentReducer } from "../components/experiment/ExperimentReducer";
import { mlmodelReducer } from "../components/mlmodel/MLModelReducer";
import { predictionReducer } from "../components/prediction/PredictionReducer";

import modalReducer from "../components/modals/ModalReducer";

import { graphReducer } from "../components/graph/GraphReducer";

import projectListReducer from "../components/projectList/ProjectListReducer";
import webSocketReducer from "../components/websocketContainer/WebSocketReducer";
export default history =>
  combineReducers({
    router: connectRouter(history),
    auth: authReducer,
    errors: errorsReducer,
    projects: projectListReducer,
    projectDetail: projectDetailReducer,
    //  fileUpload: fileUploadReducer,
    //datasources: datasourcesReducer,
    dataFrameList: dataFrameListReducer,
    dataFramePreview: dataFramePreviewReducer,
    experiment: experimentReducer,
    graph: graphReducer,
    fileUpload: fileUploadReducer,
    fileUploadList: fileUploadListReducer,

    dataFrameColumns: dataFrameColumnsReducer,
    modal: modalReducer,
    columnsUsage: columnsUsageReducer,
    mlmodel: mlmodelReducer,
    prediction: predictionReducer,
    database: databaseReducer,
    webSocket: webSocketReducer
  });
