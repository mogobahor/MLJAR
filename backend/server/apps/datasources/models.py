from django.db import models
from django.contrib.postgres.fields import JSONField

from django.utils.timezone import now
from apps.accounts.models import MljarUser, Organization
from apps.projects.models import Project

from apps.common.fields import AutoCreatedField
from apps.common.fields import AutoLastModifiedField
from apps.common.organization_item_mixin import OrganizationItemMixin
from apps.common.project_item_mixin import ProjectItemMixin
from apps.common.task_item_mixin import TaskItemMixin
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType


class FileDataSource(ProjectItemMixin):
    title = models.TextField()
    description = models.TextField(blank=True, null=True)
    absolute_path = models.CharField(max_length=1024)
    file_name = models.CharField(max_length=256)  # file name from upload
    file_size = models.DecimalField(decimal_places=4, max_digits=12)  # in MB


class DatabaseSource(OrganizationItemMixin):
    name = models.TextField()
    db_settings = models.BinaryField(editable=True)
    db_type = models.CharField(max_length=256)


class Query(ProjectItemMixin, TaskItemMixin):
    name = models.TextField()
    query_text = models.TextField(blank=True, null=True)
    parent_database_source = models.ForeignKey(
        DatabaseSource, on_delete=models.CASCADE, blank=True, null=True
    )
    #result_dataframe = models.ForeignKey(
    #    DataFrame, on_delete=models.CASCADE, blank=True, null=True
    #)
    saved = models.BooleanField(null=True, blank=True, default=False)


class DataFrame(ProjectItemMixin, TaskItemMixin):

    absolute_path = models.CharField(max_length=1024)  # file path in storage
    file_size = models.DecimalField(decimal_places=4, max_digits=12)  # in MB
    dataframe_details = JSONField(blank=True, null=True)
    columns_details = JSONField(blank=True, null=True)
    preview_data = JSONField(blank=True, null=True)

    source_file = models.OneToOneField(FileDataSource, on_delete=models.CASCADE, blank=True, null=True)
    source_query = models.OneToOneField(Query, on_delete=models.CASCADE, blank=True, null=True)
