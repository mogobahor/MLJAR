import time
import copy
import os.path
import json
from cryptography.fernet import Fernet
from rest_framework.viewsets import ModelViewSet, GenericViewSet
from rest_framework.mixins import RetrieveModelMixin, ListModelMixin
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from apps.datasources.models import FileDataSource, DataFrame, DatabaseSource, Query
from apps.datasources.serializers import (
    FileDataSourceSerializer,
    DataFrameSerializer,
    DatabaseSourceSerializer,
    QuerySerializer,
)

from django.db import transaction

from rest_framework.exceptions import APIException
from rest_framework import permissions
from apps.common.permissions import IsAuthenticatedAndFromOrganization
from apps.accounts.models import Organization
from apps.datasources.models import DataFrame, Query, DatabaseSource

from apps.projects.flow import FlowManager
from worker import consumer


from storage.storage import Storage
from config import FERNET_KEY


class GetDataFramePreview(APIView):
    permission_classes = (IsAuthenticatedAndFromOrganization,)

    def get(self, request, organization_slug, project_id, dataframe_id, format=None):
        try:
            dataframe = DataFrame.objects.get(pk=dataframe_id)
            return Response({"preview_data": dataframe.preview_data})
        except DataFrame.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response(str(e), status=status.HTTP_404_NOT_FOUND)

class GetDataFrameDetails(APIView):
    permission_classes = (IsAuthenticatedAndFromOrganization,)

    def get(self, request, organization_slug, project_id, dataframe_id, format=None):
        try:
            dataframe = DataFrame.objects.get(pk=dataframe_id)

            name = "DataFrame "
            if dataframe.source_file is not None:
                name += "from uploaded file " + dataframe.source_file.title
            if dataframe.source_query is not None:
                name += "from query " + dataframe.source_query.name

            return Response({
                            "name": name,
                            "preview_data": dataframe.preview_data,
                            "columns_details": dataframe.columns_details,
                            "dataframe_details":dataframe.dataframe_details
                            })
        except DataFrame.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response(str(e), status=status.HTTP_404_NOT_FOUND)


class GetDataFrameColumns(APIView):
    permission_classes = (IsAuthenticatedAndFromOrganization,)

    def get(self, request, organization_slug, project_id, dataframe_id, format=None):

        try:
            dataframe = DataFrame.objects.get(pk=dataframe_id)
            return Response(
                {
                    "columns_details": dataframe.columns_details
                }
            )

        except DataFrame.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response(str(e), status=status.HTTP_404_NOT_FOUND)


class FileDataSourceViewSet(ModelViewSet):

    serializer_class = FileDataSourceSerializer
    queryset = FileDataSource.objects.all()
    permission_classes = (IsAuthenticatedAndFromOrganization,)

    def get_queryset(self):
        organization_slug = self.kwargs.get("organization_slug")
        project_id = self.kwargs.get("project_id")
        return self.queryset.filter(
            parent_organization__slug=organization_slug, parent_project__id=project_id
        )

    def perform_create(self, serializer):
        print("file data source create")
        organization_slug = self.kwargs.get("organization_slug")
        project_id = self.kwargs.get("project_id")
        try:
            with transaction.atomic():
                # Save instance to DB
                instance = serializer.save(
                    created_by=self.request.user,
                    parent_organization=Organization.objects.get(
                        slug=organization_slug
                    ),
                    parent_project_id=project_id,
                )
                # Insert job to worker
                job_params = copy.deepcopy(
                    serializer.validated_data
                )  # dont want to see db_id in returned params
                job_params["db_id"] = instance.id
                job_params["created_by_id"] = instance.created_by.id
                job_params["parent_organization_id"] = instance.parent_organization.id
                job_params["parent_project_id"] = instance.parent_project.id
                transaction.on_commit(
                    lambda: consumer.ReadUploadedFileTask.delay(job_params)
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


class DataFrameViewSet(RetrieveModelMixin, ListModelMixin, GenericViewSet):
    serializer_class = DataFrameSerializer
    queryset = DataFrame.objects.all()
    permission_classes = (IsAuthenticatedAndFromOrganization,)

    def get_queryset(self):
        organization_slug = self.kwargs.get("organization_slug")
        project_id = self.kwargs.get("project_id")
        return self.queryset.filter(
            parent_organization__slug=organization_slug, parent_project__id=project_id
        )


def json_settings_encrypt(data):
    cipher_suite = Fernet(str.encode(FERNET_KEY))
    ciphered_text = cipher_suite.encrypt(str.encode(json.dumps(data)))
    return ciphered_text


def json_settings_decrypt(ciphered_text):
    cipher_suite = Fernet(str.encode(FERNET_KEY))
    print("a")
    print(ciphered_text)
    print(type(ciphered_text))

    unciphered_text = cipher_suite.decrypt(bytes(ciphered_text))
    print(unciphered_text)
    return json.loads(unciphered_text.decode())


class DatabaseSourceViewSet(ModelViewSet):

    serializer_class = DatabaseSourceSerializer
    queryset = DatabaseSource.objects.all()
    permission_classes = (IsAuthenticatedAndFromOrganization,)

    def get_queryset(self):
        organization_slug = self.kwargs.get("organization_slug")
        return self.queryset.filter(parent_organization__slug=organization_slug)

    def perform_create(self, serializer):
        print(" data base source create")
        organization_slug = self.kwargs.get("organization_slug")
        print(organization_slug)
        # try:
        with transaction.atomic():

            db_settings = json_settings_encrypt(
                serializer.validated_data.get("settings")
            )
            # Save instance to DB
            del serializer.validated_data["settings"]
            instance = serializer.save(
                db_settings=db_settings,
                created_by=self.request.user,
                parent_organization=Organization.objects.get(slug=organization_slug),
            )
        # except Exception as e:
        #    raise APIException(str(e))

    def perform_destroy(self, instance):
        print("destroy")
        try:
            with transaction.atomic():
                instance.delete()
        except Exception as e:
            raise APIException(str(e))


class QueryViewSet(ModelViewSet):

    serializer_class = QuerySerializer
    queryset = Query.objects.all()
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
                # Save instance to DB
                instance = serializer.save(
                    created_by=self.request.user,
                    parent_organization=Organization.objects.get(
                        slug=organization_slug
                    ),
                    parent_project_id=project_id,
                )
        except Exception as e:
            raise APIException(str(e))


class ExecuteQueryView(APIView):

    permission_classes = (IsAuthenticatedAndFromOrganization,)

    def post(self, request, organization_slug, project_id, query_id):

        try:
            with transaction.atomic():
                query = Query.objects.select_for_update().get(pk=query_id)

                if "name" in request.data:
                    query.name = request.data["name"]
                if "query_text" in request.data:
                    query.query_text = request.data["query_text"]
                if "parent_database_source" in request.data:
                    query.parent_database_source = DatabaseSource.objects.get(
                        pk=request.data["parent_database_source"]
                    )
                query.save()

                job_params = {}
                job_params["db_id"] = query.id
                job_params["created_by_id"] = query.created_by.id
                job_params["parent_organization_id"] = query.parent_organization.id
                job_params["parent_project_id"] = query.parent_project.id
                job_params["parent_database_source"] = query.parent_database_source.id

                transaction.on_commit(lambda: consumer.RunQueryTask.delay(job_params))

                return Response(QuerySerializer(query).data)
        except Exception as e:
            raise APIException(str(e))

        return Response(status=status.HTTP_200_OK)
