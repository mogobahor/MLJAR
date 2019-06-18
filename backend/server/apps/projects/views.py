from rest_framework import viewsets
from apps.projects.models import Project
from apps.projects.serializers import ProjectSerializer

from django.db import transaction

from rest_framework.exceptions import APIException
from rest_framework import permissions
import time
import copy
from apps.common.permissions import IsAuthenticatedAndFromOrganization
from apps.accounts.models import Organization


class ProjectViewSet(viewsets.ModelViewSet):

    serializer_class = ProjectSerializer
    queryset = Project.objects.all()
    permission_classes = (IsAuthenticatedAndFromOrganization,)

    def get_queryset(self):
        organization_slug = self.kwargs.get("organization_slug")
        return Project.objects.filter(parent_organization__slug=organization_slug)

    def perform_create(self, serializer):
        organization_slug = self.kwargs.get("organization_slug")
        try:
            with transaction.atomic():
                instance = serializer.save(
                    created_by=self.request.user,
                    parent_organization=Organization.objects.get(
                        slug=organization_slug
                    ),
                )
        except Exception as e:
            raise APIException(str(e))

    def perform_destroy(self, instance):
        print("destroy")
        try:
            with transaction.atomic():
                instance.delete()
        except Exception as e:
            raise APIException(str(e))
