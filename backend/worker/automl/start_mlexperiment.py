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

from celery import chord, group


def submit_models_for_training(experiment_id, train_models_jobs_params):
    logger.info(
        "Submit models for training, train_models_jobs_params: {0}".format(
            train_models_jobs_params
        )
    )
    from worker.consumer import TrainMLModelTask
    from worker.consumer import FinishMLExperimentTask

    tasks = []
    for job_params in train_models_jobs_params:
        tasks += [TrainMLModelTask.s(job_params)]
    print(tasks)
    chord(tasks)(FinishMLExperimentTask.s({"db_id": experiment_id}))


class StartMLExperiment:
    def __init__(self, params):
        self.job_params = params
        logger.info("StartMLExperiment input parameters: {0}".format(self.job_params))

    def params_to_key(self, model_params):
        key = "organization-{0}-user-{1}-project-{2}-experiment-{3}".format(
            self.job_params.get("parent_organization_id"),
            self.job_params.get("created_by_id"),
            self.job_params.get("parent_project_id"),
            self.job_params.get("db_id"),
        )
        for p, v in model_params.items():
            key += "-{0}-{1}".format(p, v)
        return key

    def run(self):

        with transaction.atomic():
            train_models_jobs_params = []
            # update status
            mlexperiment = MLExperiment.objects.get(pk=self.job_params.get("db_id"))
            mlexperiment.status = "started"
            mlexperiment.save()
            # define models
            for i in range(3):
                # prepare parameters
                model_type = "Xgboost"  # run with xgboost for now
                model_params = {
                    "objective": "binary:logistic",
                    "eval_metric": "logloss",
                    "eta": 0.01 * ((i + 1) * 5),
                }
                model_key = self.params_to_key(model_params)
                # save in DB
                mlmodel = MLModel(
                    model_type=model_type,
                    model_key=model_key,
                    params=model_params,
                    training_details={},
                    created_by_id=self.job_params["created_by_id"],
                    parent_organization_id=self.job_params["parent_organization_id"],
                    parent_project_id=self.job_params["parent_project_id"],
                    parent_experiment_id=self.job_params["db_id"],
                )
                mlmodel.save()
                # save ml model id as job_param
                train_models_jobs_params += [{"db_id": mlmodel.id}]

            # all all new models into the queue
            transaction.on_commit(
                lambda: submit_models_for_training(
                    self.job_params["db_id"], train_models_jobs_params
                )
            )
