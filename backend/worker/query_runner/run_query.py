import os
import json
import logging
import numpy as np
import pandas as pd
import uuid
import datetime

from worker.etl.serve import DataServe
from storage.storage import Storage

logger = logging.getLogger(__name__)

from apps.datasources.models import DataFrame
from apps.ml.models import MLExperiment, MLModel
from apps.datasources.models import Query

from django.db import transaction

from celery import chord, group

from cryptography.fernet import Fernet
from config import FERNET_KEY

from worker.query_runner.postgres import PostgresQueryRunner
from worker.task_updater import TaskUpdater


def json_settings_decrypt(ciphered_text):
    cipher_suite = Fernet(str.encode(FERNET_KEY))
    unciphered_text = cipher_suite.decrypt(bytes(ciphered_text))
    return json.loads(unciphered_text.decode())


class RunQuery:
    def __init__(self, params):
        self.job_params = params
        logger.info("RunQuery input parameters: {0}".format(self.job_params))

    def run(self):
        TaskUpdater.update_db(
            "query",
            db_id=self.job_params["db_id"],
            task_id=self.job_params["task_id"],
            new_status="started",
            start_time=datetime.datetime.utcnow(),
        )
        # Get the query
        query = Query.objects.get(pk=self.job_params["db_id"])
        db = query.parent_database_source
        settings = json_settings_decrypt(db.db_settings)

        TaskUpdater.update_db(
            "query", db_id=self.job_params["db_id"], new_status="progress"
        )
        pg = PostgresQueryRunner(settings)
        df, error = pg.run_query(query.query_text)

        print(df, error)
        if error is not None:
            TaskUpdater.update_db(
                "query",
                db_id=self.job_params["db_id"],
                new_status="error",
                error_details=error,
            )
            query.result_dataframe = None
            query.save()
            return

        # save data frame to CSV
        absolute_path = self._get_absolute_file_path(query)
        df.to_csv(absolute_path, index=False)
        # Compute preview JSON
        json_preview = self.getPreviewJSONString(df)

        # if no result data frame create new
        if not hasattr(query, 'dataframe'):
            self._create_result_dataframe(
                query, absolute_path, json_preview
            )
        # if result is present do update
        else:
            self._update_result_dataframe(
                query, absolute_path, json_preview
            )

        TaskUpdater.update_db(
            "query",
            db_id=self.job_params["db_id"],
            new_status="done",
            result=json_preview,
        )

    def _create_result_dataframe(self, query, absolute_path, json_preview):
        result_df = DataFrame(
            source_query=query,
            absolute_path=absolute_path,
            file_size=1,  # TODO fix the file size
            columns_details={},
            preview_data=json_preview,
            created_by_id=query.created_by.id,
            parent_organization_id=query.parent_organization.id,
            parent_project_id=query.parent_project.id,
        )
        result_df.save()



    def _update_result_dataframe(self, query, absolute_path, json_preview):
        result_df = query.dataframe
        result_df.absolute_path = absolute_path
        result_df.file_size = 1  # TODO fix the file size
        result_df.columns_details = {}
        result_df.preview_data = json_preview
        result_df.save()

    def _get_absolute_file_path(self, query):
        filename = "query-result-{}".format(str(uuid.uuid4())[:8])
        relative_dir = "org_{0}_proj_{1}".format(
            query.parent_organization.slug, query.parent_project.id
        )
        relative_path = os.path.join(relative_dir, filename)
        absolute_path = Storage().get_path(relative_dir, filename)
        print("result:", absolute_path)
        return absolute_path

    # Method return STRING
    def getPreviewJSONString(self, df):
        logger.debug("Create DataFrame JSON preview, df shape {0}".format(df.shape))
        nrows, ncols = df.shape
        # prepare preview only for data frames with less than 100 columns
        # TODO need to add column pagination on data frames
        # or show first 50 and last 50 columns
        if df.shape[1] > ncols:
            return None
        # max 100 rows from the top of data frame
        max_rows = np.min([100, nrows])
        return df.head(max_rows).to_json(orient="records")
