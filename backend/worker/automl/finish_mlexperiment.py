import os
import json
import logging
import numpy as np
import pandas as pd

from worker.etl.serve import DataServe
from storage.storage import Storage

logger = logging.getLogger(__name__)

from apps.datasources.models import DataFrame
from apps.ml.models import MLExperiment, MLModel


from django.db import transaction


class FinishMLExperiment:
    def __init__(self, params):
        self.job_params = params
        logger.info("FinishMLExperiment input parameters: {0}".format(self.job_params))

    def run(self):

        with transaction.atomic():
            # update status
            logger.info(
                "FinishMLExperiment set status done: MLExperiment{0}".format(
                    self.job_params.get("db_id")
                )
            )
            mlexperiment = MLExperiment.objects.get(pk=self.job_params.get("db_id"))
            mlexperiment.status = "done"
            mlexperiment.save()
