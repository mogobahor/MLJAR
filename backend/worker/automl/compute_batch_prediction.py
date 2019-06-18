import os
import json
import uuid
import logging
import numpy as np
import pandas as pd

from worker.etl.serve import DataServe
from storage.storage import Storage

logger = logging.getLogger(__name__)

from apps.datasources.models import DataFrame
from apps.ml.models import MLModel
from apps.ml.models import MLBatchPrediction


from supervised.iterative_learner_framework import IterativeLearner


class ComputeBatchPrediction:
    def __init__(self, params):
        # set params
        self.job_params = params
        logger.info(
            "ComputeBatchPrediction input parameters: {0}".format(self.job_params)
        )

    def run(self):
        # read data
        logger.info("ComputeBatchPrediction::run")

        batch = MLBatchPrediction.objects.get(pk=self.job_params.get("db_id"))
        logger.info("batch", batch)
        # {'parent_mlmodel': 9, 'parent_dataframe': 1, 'db_id': 1, 'created_by_id': 1, 'parent_organization_id': 1, 'parent_project_id': 1}

        mlmodel = MLModel.objects.get(pk=self.job_params.get("parent_mlmodel"))
        logger.info(mlmodel.save_details)
        logger.info(mlmodel.all_params)
        il = IterativeLearner(mlmodel.all_params)
        il.load(mlmodel.save_details)
        logger.info(batch.parent_dataframe.absolute_path)
        input_df = DataServe.get(batch.parent_dataframe.absolute_path)

        predictions = il.predict(input_df)
        logger.info(predictions)

        filename = "predictions-{0}.csv".format(str(uuid.uuid4())[:8])
        organization_slug = batch.parent_organization.slug
        project_id = batch.parent_project.id
        relative_dir = "org_{0}_proj_{1}".format(organization_slug, project_id)
        relative_path = os.path.join(relative_dir, filename)
        result_absolute_path = Storage().get_path(relative_dir, filename)

        logger.info(result_absolute_path)

        df = pd.DataFrame({"prediction": predictions})
        df.to_csv(result_absolute_path, index=False)

        # create mljar data frame
        result_df = DataFrame(
            source_id=self.job_params.get("parent_dataframe"),  # fix this
            absolute_path=result_absolute_path,
            file_size=1,  # TODO fix the file size
            columns_details="",  # we can describe any data frame (always :-))
            preview_absolute_path="",
            created_by_id=self.job_params["created_by_id"],
            parent_organization_id=self.job_params["parent_organization_id"],
            parent_project_id=self.job_params["parent_project_id"],
        )
        result_df.save()

        batch.result_dataframe = result_df
        batch.status = "done"
        batch.save()
