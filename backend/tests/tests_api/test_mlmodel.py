import unittest
import requests
import copy
import time
from tests.test_base import TestBase

from apps.projects.models import Project
from apps.ml.models import MLExperiment
from apps.ml.models import MLModel
from apps.accounts.models import MljarUser, Organization


class TestMLModel(TestBase):
    def test_create_mlmodel(self):
        token = self.create_user_and_login(self.user1_params)
        project = self.create_project()
        data_frame = self.create_data_frame(project)
        ml_columns_usage = self.create_ml_columns_usage(project)
        self.assertEqual(len(MLModel.objects.all()), 0)
        ml_experiment = self.create_ml_experiment(
            token, project, data_frame, ml_columns_usage
        )
        time.sleep(2)  # need to wait for worker
        self.assertTrue(len(MLModel.objects.all()) > 0)

        # POST on MLModels is not allowed (HTTP 405)
        ml_model = self.request(
            "post",
            "/api/v1/{0}/{1}/ml_models".format(
                self.user1_params["organization_slug"], project.id
            ),
            {},
            token,
            405,
        )
        ml_models = self.request(
            "get",
            "/api/v1/{0}/{1}/ml_models".format(
                self.user1_params["organization_slug"], project.id
            ),
            {},
            token,
            200,
        )
        self.assertTrue(len(ml_models) > 0)
        self.assertEqual(ml_models[0]["parent_experiment"], ml_experiment["id"])
        time.sleep(1) # ugly wait for worker

if __name__ == "__main__":
    unittest.main()
