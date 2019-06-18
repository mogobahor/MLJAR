import os
import sys
import json
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


class TestProcessUploadedFile(TestBase):
    def test_preprocess(self):
        # set user
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
        ########################################################################
        # run job
        ########################################################################
        process_file = ProcessUploadedFile(job_params)
        process_file.run()
        ########################################################################
        # check if all is good
        self.assertEqual(DataFrame.objects.all().count(), 1)
        self.assertTrue(DataFrame.objects.filter(source_id=ds.id).count(), 1)
        dataframe = DataFrame.objects.get(source_id=ds.id)

        preview = self.request(
            method="get",
            endpoint="/api/v1/{0}/{1}/dataframe_preview/{2}".format(
                self.org1, project.id, dataframe.id
            ),
            payload={},
            token=token,
            expected_status_code=200,
        )
        self.assertEqual(len(json.loads(preview.get("preview_data"))), 100)
        self.assertTrue("columns_description" in preview)
        self.assertTrue("nrows" in preview)
        self.assertTrue("ncols" in preview)

        frames = self.request(
            method="get",
            endpoint="/api/v1/{0}/{1}/dataframes".format(self.org1, project.id),
            payload={},
            token=token,
            expected_status_code=200,
        )
        print(frames)
