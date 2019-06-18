from django.db import models
from django.contrib.postgres.fields import JSONField

from django.utils.timezone import now
from apps.accounts.models import MljarUser, Organization

from apps.common.fields import AutoCreatedField
from apps.common.fields import AutoLastModifiedField

from apps.common.organization_item_mixin import OrganizationItemMixin


class Project(OrganizationItemMixin):
    title = models.TextField()
    description = models.TextField(blank=True, null=True)
