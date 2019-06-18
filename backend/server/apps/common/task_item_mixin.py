from django.db import models
from django.contrib.postgres.fields import JSONField


class TaskItemMixin(models.Model):

    started_at = models.DateTimeField(null=True, blank=True)
    compute_time = models.IntegerField(blank=True, null=True)  # in seconds
    statuses = (
        ("created", "Created"),
        ("started", "Started"),
        ("progress", "In progress"),
        ("done", "Done"),
        ("error", "Error"),
    )
    status = models.CharField(
        max_length=32, choices=statuses, default="created", blank=False
    )
    errors = JSONField(blank=True, null=True)
    task_id = models.CharField(max_length=128)  # worker task id

    class Meta:
        abstract = True
