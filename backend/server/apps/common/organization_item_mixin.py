from django.db import models
from apps.accounts.models import MljarUser, Organization
from apps.common.fields import AutoCreatedField
from apps.common.fields import AutoLastModifiedField


class OrganizationItemMixin(models.Model):
    created_at = AutoCreatedField()
    updated_at = AutoLastModifiedField()

    created_by = models.ForeignKey(MljarUser, on_delete=models.CASCADE)
    parent_organization = models.ForeignKey(Organization, on_delete=models.CASCADE)

    class Meta:
        abstract = True
