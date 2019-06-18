import time
import copy

from django.db import transaction
from rest_framework import viewsets
from rest_framework import mixins
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework.exceptions import APIException

from apps.common.permissions import IsAuthenticatedAndFromOrganization
from apps.accounts.models import Organization
from apps.ml.models import MLColumnsUsage, MLExperiment, MLModel, MLBatchPrediction
from apps.ml.serializers import (
    MLColumnsUsageSerializer,
    MLExperimentSerializer,
    MLModelSerializer,
    MLBatchPredictionSerializer,
)
from worker import consumer
from apps.projects.flow import FlowManager


class MLColumnsUsageViewSet(viewsets.ModelViewSet):

    serializer_class = MLColumnsUsageSerializer
    queryset = MLColumnsUsage.objects.all()
    permission_classes = (IsAuthenticatedAndFromOrganization,)

    def get_queryset(self):
        organization_slug = self.kwargs.get("organization_slug")
        project_id = self.kwargs.get("project_id")
        return self.queryset.filter(
            parent_organization__slug=organization_slug, parent_project__id=project_id
        )

    def perform_create(self, serializer):
        organization_slug = self.kwargs.get("organization_slug")
        project_id = self.kwargs.get("project_id")
        try:
            with transaction.atomic():
                instance = serializer.save(
                    created_by=self.request.user,
                    parent_organization=Organization.objects.get(
                        slug=organization_slug
                    ),
                    parent_project_id=project_id,
                )

        except Exception as e:
            raise APIException(str(e))


class MLExperimentViewSet(viewsets.ModelViewSet):
    """
        Machine Learning Experiment.
    """

    serializer_class = MLExperimentSerializer
    queryset = MLExperiment.objects.all()
    permission_classes = (IsAuthenticatedAndFromOrganization,)

    def get_queryset(self):
        organization_slug = self.kwargs.get("organization_slug")
        project_id = self.kwargs.get("project_id")
        return self.queryset.filter(
            parent_organization__slug=organization_slug, parent_project__id=project_id
        )

    def perform_create(self, serializer):
        organization_slug = self.kwargs.get("organization_slug")
        project_id = self.kwargs.get("project_id")
        try:
            with transaction.atomic():
                instance = serializer.save(
                    created_by=self.request.user,
                    parent_organization=Organization.objects.get(
                        slug=organization_slug
                    ),
                    parent_project_id=project_id,
                )
                print(instance)
                job_params = copy.deepcopy(
                    serializer.validated_data
                )  # dont want to see db_id in returned params
                job_params["db_id"] = instance.id
                job_params["created_by_id"] = instance.created_by.id
                job_params["parent_organization_id"] = instance.parent_organization.id
                job_params["parent_project_id"] = instance.parent_project.id
                job_params["parent_columns_usage"] = job_params[
                    "parent_columns_usage"
                ].id
                job_params["parent_training_dataframe"] = job_params[
                    "parent_training_dataframe"
                ].id
                # job_params["parent_validation_dataframe"] = job_params["parent_validation_dataframe"].id

                transaction.on_commit(
                    lambda: consumer.StartMLExperimentTask.delay(job_params)
                )
        except Exception as e:
            raise APIException(str(e))

    def perform_destroy(self, instance):
        print("experiment destroy")
        try:
            with transaction.atomic():
                instance.delete()
        except Exception as e:
            raise APIException(str(e))


class MLModelViewSet(
    mixins.RetrieveModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet
):

    serializer_class = MLModelSerializer
    queryset = MLModel.objects.all()
    permission_classes = (IsAuthenticatedAndFromOrganization,)

    def get_queryset(self):
        organization_slug = self.kwargs.get("organization_slug")
        project_id = self.kwargs.get("project_id")

        return self.queryset.filter(
            parent_organization__slug=organization_slug, parent_project__id=project_id
        )


class MLBatchPredictionViewSet(viewsets.ModelViewSet):

    serializer_class = MLBatchPredictionSerializer
    queryset = MLBatchPrediction.objects.all()
    permission_classes = (IsAuthenticatedAndFromOrganization,)

    def get_queryset(self):
        organization_slug = self.kwargs.get("organization_slug")
        project_id = self.kwargs.get("project_id")
        return self.queryset.filter(
            parent_organization__slug=organization_slug, parent_project__id=project_id
        )

    def perform_create(self, serializer):
        organization_slug = self.kwargs.get("organization_slug")
        project_id = self.kwargs.get("project_id")
        try:
            with transaction.atomic():
                instance = serializer.save(
                    created_by=self.request.user,
                    parent_organization=Organization.objects.get(
                        slug=organization_slug
                    ),
                    parent_project_id=project_id,
                )
                print(instance)
                job_params = copy.deepcopy(
                    serializer.validated_data
                )  # dont want to see db_id in returned params
                print("job_params", job_params)
                job_params["db_id"] = instance.id
                job_params["created_by_id"] = instance.created_by.id
                job_params["parent_organization_id"] = instance.parent_organization.id
                job_params["parent_project_id"] = instance.parent_project.id
                job_params["parent_mlmodel"] = job_params["parent_mlmodel"].id
                job_params["parent_dataframe"] = job_params["parent_dataframe"].id

                print("job_params", job_params)

                transaction.on_commit(
                    lambda: consumer.ComputeBatchPredictionTask.delay(job_params)
                )
        except Exception as e:
            raise APIException(str(e))
