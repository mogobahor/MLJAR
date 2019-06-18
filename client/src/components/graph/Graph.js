import * as React from "react";

import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import isEmpty from "../../validation/isEmpty";

import { GraphView, type INodeType as INode } from "react-digraph";
import GraphConfig, {
  NODE_KEY,
  EDGE_TYPE,
  UPLOADED_FILE_TYPE,
  // DATAFRAME_TYPE,
  COLUMNS_SELECTION_TYPE,
  MLEXPERIMENT_TYPE,
  SELECTED_MLMODEL_TYPE
} from "./GraphConfig";

import { selectNode } from "./GraphActions.js";

import { getUploadedFile } from "../fileUploadList/FileUploadListActions";
import { getColumnsUsage } from "../columnsUsage/ColumnsUsageActions";
import { getExperiment } from "../experiment/ExperimentActions";
const sample = {
  edges: [
    {
      handleText: "Training data",
      source: "a1",
      target: "a3",
      type: EDGE_TYPE
    },
    {
      handleText: "Select ML columns",
      source: "a2",
      target: "a3",
      type: EDGE_TYPE
    },
    {
      handleText: "Best model",
      source: "a3",
      target: "a4",
      type: EDGE_TYPE
    }
  ],
  nodes: [
    {
      id: "a1",
      title: "File upload",
      type: UPLOADED_FILE_TYPE,
      x: 0,
      y: 0,
      data: { msg: "more" }
    },
    {
      id: "a2",
      title: "Columns selection",
      type: COLUMNS_SELECTION_TYPE,
      x: 200,
      y: 0
    },
    {
      id: "a3",
      title: "ML Experiment",
      type: MLEXPERIMENT_TYPE,
      x: 100,
      y: 200
    },
    {
      id: "a4",
      title: "Selected model",
      type: SELECTED_MLMODEL_TYPE,
      x: 100,
      y: 400
    }
  ]
};

class Graph extends React.Component {
  GraphView;

  constructor(props) {
    super(props);
    this.state = {
      selected: null,
      totalNodes: sample.nodes.length
    };
    this.GraphView = React.createRef();
  }

  componentDidMount() {}

  // Helper to find the index of a given node
  getNodeIndex(searchNode: INode | any) {
    return this.state.graph.nodes.findIndex(node => {
      return node[NODE_KEY] === searchNode[NODE_KEY];
    });
  }

  onUpdateNode = (viewNode: INode) => {
    const graph = this.state.graph;
    const i = this.getNodeIndex(viewNode);
    graph.nodes[i] = viewNode;
    this.setState({ graph });
  };

  onSelectNode = viewNode => {
    if (!isEmpty(viewNode)) {
      this.setState({ selected: viewNode });
      this.props.selectNode(viewNode);
      const { organization_slug } = this.props.organization_slug;
      const { project_id } = this.props.project_id;
      if (viewNode.type === UPLOADED_FILE_TYPE) {
        this.props.getUploadedFile(
          organization_slug,
          project_id,
          viewNode.db_id
        );
      } else if (viewNode.type === COLUMNS_SELECTION_TYPE) {
        this.props.getColumnsUsage(
          organization_slug,
          project_id,
          viewNode.db_id
        );
      } else if (viewNode.type === MLEXPERIMENT_TYPE) {
        this.props.getExperiment(organization_slug, project_id, viewNode.db_id);
      }
    }
  };

  render() {
    const { NodeTypes, NodeSubtypes, EdgeTypes } = GraphConfig;
    const { projectDetail } = this.props.projectDetail;
    if (isEmpty(projectDetail)) {
      return <div>Loading the flow ...</div>;
    }
    if (isEmpty(projectDetail.flow)) {
      return (
        <div>The flow is empty. Please add data source to your project.</div>
      );
    }

    const { nodes, edges } = projectDetail.flow;

    return (
      <div id="graph">
        <GraphView
          ref={el => (this.GraphView = el)}
          nodeKey={NODE_KEY}
          nodes={nodes}
          edges={edges}
          selected={this.state.selected}
          nodeTypes={NodeTypes}
          nodeSubtypes={NodeSubtypes}
          edgeTypes={EdgeTypes}
          gridSpacing={10}
          gridDotSize={0.6}
          edgeArrowSize={2.5}
          edgeHandleSize={0.1}
          canDeleteNode={false}
          canDeleteEdge={false}
          canCreateEdge={false}
          onSelectNode={this.onSelectNode}
          onUpdateNode={this.onUpdateNode}
          showGraphControls={true}
          readOnly={true}
          layoutEngineType={"SnapToGrid"}
        />
      </div>
    );
  }
}
//minZoom={1}
//maxZoom={1}
//export default Graph;

Graph.propTypes = {
  //getGraphData: PropTypes.func.isRequired,
  //updateGraphData: PropTypes.func.isRequired,
  getUploadedFile: PropTypes.func.isRequired,
  getColumnsUsage: PropTypes.func.isRequired,
  getExperiment: PropTypes.func.isRequired,

  selectNode: PropTypes.func.isRequired,
  organization_slug: PropTypes.object.isRequired,
  project_id: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  organization_slug: ownProps.match.params,
  project_id: ownProps.match.params,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { selectNode, getUploadedFile, getColumnsUsage, getExperiment }
)(withRouter(Graph));
