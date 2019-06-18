import unittest
import requests
import copy
import time
from tests.test_base import TestBase

from apps.projects.models import Project
from apps.ml.models import MLExperiment
from apps.accounts.models import MljarUser, Organization


class TestMLExperiment(TestBase):
    def test_create_mlexperiment(self):
        token = self.create_user_and_login(self.user1_params)
        project = self.create_project()
        data_frame = self.create_data_frame(project)
        ml_columns_usage = self.create_ml_columns_usage(project)
        self.assertEqual(len(MLExperiment.objects.all()), 0)

        payload = {
            "title": "New experiment",
            "description": "Completely new",
            "params": {
                "metric": {"optimize": "logloss", "monitor": ["logloss"]},
                "validation": {
                    "validation_type": "split",
                    "train_ratio": 0.8,
                    "shuffle": True,
                },
                "preprocessing": {},
            },
            "parent_columns_usage": ml_columns_usage.id,
            "parent_training_dataframe": data_frame.id,
        }

        ml_experiment = self.request(
            "post",
            "/api/v1/{0}/{1}/ml_experiments".format(
                self.user1_params["organization_slug"], project.id
            ),
            payload,
            token,
            201,
        )
        self.assertEqual(len(MLExperiment.objects.all()), 1)
        self.assertEqual(ml_experiment["title"], payload["title"])
        time.sleep(1) # ugly wait for worker

if __name__ == "__main__":
    unittest.main()
