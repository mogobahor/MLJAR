from django.db import models
from django.contrib.postgres.fields import JSONField

from django.utils.timezone import now
from apps.accounts.models import MljarUser, Organization
from apps.projects.models import Project

from apps.common.fields import AutoCreatedField
from apps.common.fields import AutoLastModifiedField
from apps.datasources.models import DataFrame

from apps.common.project_item_mixin import ProjectItemMixin
from apps.common.task_item_mixin import TaskItemMixin


class MLColumnsUsage(ProjectItemMixin):
    title = models.TextField()
    columns_usage = JSONField(blank=True, null=True)
    target_details = JSONField(blank=True, null=True)

class MLExperiment(ProjectItemMixin, TaskItemMixin):
    title = models.TextField()
    description = models.TextField(blank=True, null=True)
    # params must have:
    # - data_usage
    # - metric to be optimized
    # - validation
    params = JSONField(blank=True, null=True)
    parent_columns_usage = models.ForeignKey(MLColumnsUsage, on_delete=models.CASCADE)
    parent_training_dataframe = models.ForeignKey(
        DataFrame, on_delete=models.CASCADE, related_name="training"
    )
    # validation can be empty, in cv or split validation
    parent_validation_dataframe = models.ForeignKey(
        DataFrame,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="validation",
    )


class MLModel(ProjectItemMixin, TaskItemMixin):
    model_key = models.TextField(db_index=True)  # the key of the model (unique hash)
    model_type = models.CharField(max_length=128, blank=False)
    params = JSONField(blank=True, null=True)  # ml model parameters (hyper-parameters)
    all_params = JSONField(
        blank=True, null=True
    )  # ml model parameters (hyper-parameters + learning details)
    training_details = JSONField(
        blank=True, null=True
    )  # ml model training details, for example the learning curves
    training_time = models.IntegerField(blank=True, null=True)  # in seconds
    metric = JSONField(blank=True, null=True)  # metric
    save_details = JSONField(blank=True, null=True)  # metric
    parent_experiment = models.ForeignKey(MLExperiment, on_delete=models.CASCADE)


class MLBatchPrediction(ProjectItemMixin, TaskItemMixin):
    parent_mlmodel = models.ForeignKey(MLModel, on_delete=models.CASCADE)
    parent_dataframe = models.ForeignKey(
        DataFrame, on_delete=models.CASCADE, related_name="input_data"
    )
    result_dataframe = models.ForeignKey(
        DataFrame,
        on_delete=models.CASCADE,
        related_name="output_data",
        blank=True,
        null=True,
    )
