import os
import sys
import time
import unittest
import requests
import copy
from tests.test_base import TestBase
from tests.data.example import example_X, example_y
from tests.data.example import data_to_file

from apps.datasources.models import FileDataSource
from apps.datasources.models import DataFrame

from apps.projects.models import Project
from apps.ml.models import MLExperiment
from apps.ml.models import MLModel
from apps.accounts.models import MljarUser, Organization

from storage.storage import Storage

from worker.etl.process_uploaded_file import ProcessUploadedFile

from worker.automl.start_mlexperiment import StartMLExperiment


class TestStartMLExperiment(TestBase):
    def test_start_mlexperiment(self):

        token = self.create_user_and_login(self.user1_params)
        organization = Organization.objects.get(slug=self.org1)
        user = MljarUser.objects.get(email=self.user1_params["email"])
        project = Project(
            title="some title",
            description="...",
            created_by=user,
            parent_organization=organization,
        )
        project.save()

        # prepare data
        local_full_file_path = "/tmp/example.csv"
        filename = "example.csv"

        relative_dir = "test"
        absolute_path = Storage().get_path(relative_dir, filename)

        data_to_file(example_X, example_y, absolute_path)

        ds = FileDataSource(
            title="my file",
            description="desc ...",
            absolute_path=absolute_path,
            file_name=filename,
            file_size=os.path.getsize(absolute_path),
            created_by=user,
            parent_organization=organization,
            parent_project=project,
        )
        ds.save()

        job_params = {
            "absolute_path": ds.absolute_path,
            "file_name": ds.file_name,
            "db_id": ds.id,
            "created_by_id": ds.created_by.id,
            "parent_organization_id": ds.parent_organization.id,
            "parent_project_id": ds.parent_project.id,
        }

        self.assertEqual(DataFrame.objects.all().count(), 0)
        process_file = ProcessUploadedFile(job_params)
        process_file.run()
        time.sleep(1)  # not nice but till no websockets, let's use it
        self.assertEqual(DataFrame.objects.all().count(), 1)
        self.assertTrue(DataFrame.objects.filter(source_id=ds.id).count(), 1)

        mljar_df = DataFrame.objects.get(source_id=ds.id)

        print(mljar_df.columns_details)

        ### start ml experiment ###
        mlexperiment = MLExperiment(
            title="exp 1",
            description="na na ...",
            params={
                "data_usage": {"train_absolute_path": mljar_df.absolute_path},
                "metric": {"optimize": "logloss", "monitor": ["logloss", "auc"]},
                "validation": {
                    "validation_type": "split",
                    "train_ratio": 0.5,
                    "shuffle": True,
                },
                "preprocessing": {},
            },
            column_usage={
                "target": ["target"],
                "input": ["feature_{0}".format(i) for i in range(4)],
            },
            created_by_id=user.id,
            parent_organization_id=organization.id,
            parent_project_id=project.id,
        )
        mlexperiment.save()

        job_params = {
            "db_id": mlexperiment.id,
            "params": mlexperiment.params,
            "column_usage": mlexperiment.column_usage,
            "created_by_id": mlexperiment.created_by.id,
            "parent_organization_id": mlexperiment.parent_organization.id,
            "parent_project_id": mlexperiment.parent_project.id,
        }
        automl = StartMLExperiment(job_params)
        automl.run()
        mlexperiment = MLExperiment.objects.get(pk=mlexperiment.id)
        print(mlexperiment.status)
        time.sleep(1.5)
        mlexperiment = MLExperiment.objects.get(pk=mlexperiment.id)
        print(mlexperiment.status)

        self.assertEqual(mlexperiment.status, "done")
