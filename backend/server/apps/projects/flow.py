from apps.projects.models import Project
from apps.datasources.models import FileDataSource
from apps.ml.models import MLColumnsUsage
from apps.ml.models import MLExperiment


class FlowManager:
    def __init__(self, project_id):
        self.shift_x = 140
        self.shift_y = 180
        self.project = Project.objects.get(pk=project_id)
        print("Flow project", self.project)
        self.FIRST_ROW_NODE_TYPES = ["uploaded_file", "columns_selection"]
        self.SECOND_ROW_NODE_TYPES = ["mlexperiment"]

    def init_flow(self):
        self.project.flow = {"nodes": [], "edges": []}

    def save(self):
        self.project.save(update_fields=["flow"])

    def add_node(self, new_node):
        # initialize flow if needed
        if self.project.flow is None or self.project.flow == {}:
            self.init_flow()
        # add node to flow
        if isinstance(new_node, FileDataSource):
            self.add_new_data_file(new_node)
        elif isinstance(new_node, MLColumnsUsage):
            self.add_new_ml_columns_usage(new_node)
        elif isinstance(new_node, MLExperiment):
            self.add_new_ml_experiment(new_node)

    def add_new_data_file(self, new_node):
        #
        # NODE_TYPE must match the front-end node type
        NODE_TYPE = "uploaded_file"
        nodes_cnt = 0
        for n in self.project.flow["nodes"]:
            if n["type"] in self.FIRST_ROW_NODE_TYPES:
                nodes_cnt += 1
        self.project.flow["nodes"].append(
            {
                "id": "{0}_{1}".format(NODE_TYPE, new_node.id),
                "db_id": new_node.id,
                "title": new_node.title,
                "type": NODE_TYPE,
                "y": 0,
                "x": nodes_cnt * self.shift_x,
            }
        )
        self.save()

    def add_new_ml_columns_usage(self, new_node):
        #
        # NODE_TYPE must match the front-end node type
        NODE_TYPE = "columns_selection"
        nodes_cnt = 0
        for n in self.project.flow["nodes"]:
            if n["type"] in self.FIRST_ROW_NODE_TYPES:
                nodes_cnt += 1
        self.project.flow["nodes"].append(
            {
                "id": "{0}_{1}".format(NODE_TYPE, new_node.id),
                "db_id": new_node.id,
                "title": new_node.title,
                "type": NODE_TYPE,
                "y": 0,
                "x": nodes_cnt * self.shift_x,
            }
        )
        self.save()

    def add_new_ml_experiment(self, new_node):
        #
        # NODE_TYPE must match the front-end node type
        NODE_TYPE = "mlexperiment"
        nodes_cnt = 0
        for n in self.project.flow["nodes"]:
            if n["type"] in self.SECOND_ROW_NODE_TYPES:
                nodes_cnt += 1
        my_id = "{0}_{1}".format(NODE_TYPE, new_node.id)
        self.project.flow["nodes"].append(
            {
                "id": my_id,
                "db_id": new_node.id,
                "title": new_node.title,
                "type": NODE_TYPE,
                "y": self.shift_y,
                "x": nodes_cnt * self.shift_x,
            }
        )
        print("oooo")
        print(new_node.parent_columns_usage)
        print(new_node.parent_columns_usage.id)
        # add edges from data sources and columns selection
        for n in self.project.flow["nodes"]:
            print(n)
            # TODO add validation data
            if (
                n["db_id"] == new_node.parent_training_dataframe.id
                and n["type"] == "uploaded_file"
            ):
                self.project.flow["edges"].append(
                    {
                        "handleText": "",
                        "source": n["id"],
                        "target": my_id,
                        "type": "edge",
                    }
                )
            if (
                n["db_id"] == new_node.parent_columns_usage.id
                and n["type"] == "columns_selection"
            ):
                self.project.flow["edges"].append(
                    {
                        "handleText": "",
                        "source": n["id"],
                        "target": my_id,
                        "type": "edge",
                    }
                )

        self.save()
