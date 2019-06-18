from rest_framework import serializers
import apps.projects.models as models
from apps.datasources.models import FileDataSource
from apps.datasources.models import DataFrame
from apps.datasources.models import Query
from apps.ml.models import MLExperiment
from apps.ml.models import MLColumnsUsage
from apps.ml.models import MLModel
from apps.ml.models import MLBatchPrediction


class ProjectSerializer(serializers.ModelSerializer):
    created_by_username = serializers.ReadOnlyField(source="created_by.username")

    datasources_cnt = serializers.SerializerMethodField(read_only=True)
    columns_usage_cnt = serializers.SerializerMethodField(read_only=True)
    queries_cnt = serializers.SerializerMethodField(read_only=True)
    dataframes_cnt = serializers.SerializerMethodField(read_only=True)
    experiments_cnt = serializers.SerializerMethodField(read_only=True)
    models_cnt = serializers.SerializerMethodField(read_only=True)
    predictions_cnt = serializers.SerializerMethodField(read_only=True)

    def get_datasources_cnt(self, project):
        return FileDataSource.objects.filter(parent_project=project).count()

    def get_columns_usage_cnt(self, project):
        return MLColumnsUsage.objects.filter(parent_project=project).count()

    def get_queries_cnt(self, project):
        return Query.objects.filter(parent_project=project).count()

    def get_dataframes_cnt(self, project):
        return DataFrame.objects.filter(parent_project=project).count()

    def get_experiments_cnt(self, project):
        return MLExperiment.objects.filter(parent_project=project).count()

    def get_models_cnt(self, project):
        return MLModel.objects.filter(parent_project=project).count()

    def get_predictions_cnt(self, project):
        return MLBatchPrediction.objects.filter(parent_project=project).count()

    class Meta:
        model = models.Project
        read_only_fields = (
            "id",
            "created_by",
            "created_at",
            "updated_at",
            "parent_organization",
            "created_by_username",
            "datasources_cnt",
            "columns_usage_cnt",
            "dataframes_cnt",
            "experiments_cnt",
            "models_cnt",
            "predictions_cnt",
            "queries_cnt",
        )
        fields = (
            "id",
            "title",
            "description",
            "created_at",
            "updated_at",
            "created_by",
            "parent_organization",
            "created_by_username",
            "datasources_cnt",
            "columns_usage_cnt",
            "dataframes_cnt",
            "experiments_cnt",
            "models_cnt",
            "predictions_cnt",
            "queries_cnt",
        )
