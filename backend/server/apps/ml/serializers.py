from rest_framework import serializers
from apps.ml.models import MLColumnsUsage, MLExperiment, MLModel, MLBatchPrediction


class MLColumnsUsageSerializer(serializers.ModelSerializer):

    target_name = serializers.SerializerMethodField(read_only=True)
    input_cnt = serializers.SerializerMethodField(read_only=True)

    def get_target_name(self, usage):
        return usage.columns_usage["target"][0]

    def get_input_cnt(self, usage):
        return len(usage.columns_usage["input"])

    class Meta:
        model = MLColumnsUsage
        read_only_fields = (
            "id",
            "created_by",
            "created_at",
            "updated_at",
            "parent_organization",
            "parent_project",
            "target_name",
            "input_cnt"
        )
        fields = (
            "id",
            "created_by",
            "created_at",
            "updated_at",
            "parent_organization",
            "parent_project",
            "title",
            "columns_usage",
            "target_name",
            "input_cnt",
            "target_details"
        )

    def validate(self, data):
        if data.get("title") is None:
            raise serializers.ValidationError("Missing title")
        if data.get("columns_usage") is None:
            raise serializers.ValidationError("Missing columns usage definition")
        if data.get("columns_usage").get("target") is None:
            raise serializers.ValidationError("Missing target column definition")
        if data.get("columns_usage").get("input") is None:
            raise serializers.ValidationError("Missing input columns definition")
        if len(data.get("columns_usage").get("target")) != 1:
            raise serializers.ValidationError(
                "There should be exactly one target column"
            )
        if len(data.get("columns_usage").get("input")) < 2:
            raise serializers.ValidationError(
                "There should be more than one input column"
            )
        return data


class MLExperimentSerializer(serializers.ModelSerializer):

    created_by_username = serializers.ReadOnlyField(source="created_by.username")

    models_cnt = serializers.SerializerMethodField(read_only=True)

    def get_models_cnt(self, experiment):
        return MLModel.objects.filter(parent_experiment=experiment).count()

    class Meta:
        model = MLExperiment
        read_only_fields = (
            "id",
            "created_by",
            "created_at",
            "updated_at",
            "parent_organization",
            "parent_project",
            "status",
            "errors",
            "created_by_username",
            "models_cnt",
        )
        fields = (
            "id",
            "created_by",
            "created_at",
            "updated_at",
            "parent_organization",
            "parent_project",
            "title",
            "description",
            "params",
            "parent_columns_usage",
            "parent_training_dataframe",
            "parent_validation_dataframe",
            "status",
            "errors",
            "created_by_username",
            "models_cnt",
        )


class MLModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = MLModel
        read_only_fields = (
            "id",
            "created_by",
            "created_at",
            "updated_at",
            "parent_organization",
            "parent_project",
            "parent_experiment",
            "status",
            "errors",
            "model_key",
            "model_type",
            "params",
            "all_params",
            "training_details",
            "training_time",
            "metric",
            "save_details",
            "status",
            "task_id",
        )
        fields = read_only_fields


class MLBatchPredictionSerializer(serializers.ModelSerializer):
    class Meta:
        model = MLBatchPrediction
        read_only_fields = (
            "id",
            "created_by",
            "created_at",
            "updated_at",
            "parent_organization",
            "parent_project",
            "status",
            "errors",
            "compute_time",
            "status",
            "task_id",
            "result_dataframe",
        )
        fields = (
            "id",
            "created_by",
            "created_at",
            "updated_at",
            "parent_organization",
            "parent_project",
            "status",
            "errors",
            "compute_time",
            "status",
            "task_id",
            "parent_mlmodel",
            "parent_dataframe",
            "result_dataframe",
        )
