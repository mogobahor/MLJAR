import json
from rest_framework import serializers
from apps.datasources import models
from apps.datasources import views
from worker.query_runner.postgres import PostgresQueryRunner


class FileDataSourceSerializer(serializers.ModelSerializer):
    created_by_username = serializers.ReadOnlyField(source="created_by.username")

    result_dataframe_id = serializers.SerializerMethodField(read_only=True)

    def get_result_dataframe_id(self, instance):
        if not hasattr(instance, 'dataframe'):
            return None
        return instance.dataframe.id


    class Meta:
        model = models.FileDataSource
        read_only_fields = (
            "id",
            "created_by",
            "created_at",
            "updated_at",
            "parent_organization",
            "parent_project",
            "created_by_username",
            "result_dataframe_id"
        )
        fields = (
            "id",
            "title",
            "description",
            "absolute_path",
            "file_name",
            "file_size",
            "created_at",
            "updated_at",
            "created_by",
            "parent_organization",
            "parent_project",
            "created_by_username",
            "result_dataframe_id"
        )


class DataFrameSerializer(serializers.ModelSerializer):
    created_by_username = serializers.ReadOnlyField(source="created_by.username")
    name = serializers.SerializerMethodField(read_only=True)

    def get_name(self, instance):
        if instance.source_file is not None:
            return "DataFrame: " + instance.source_file.title
        if instance.source_query is not None:
            return "DataFrame: " + instance.source_query.name

        return "DataFrame"

    class Meta:
        model = models.DataFrame
        read_only_fields = (
            "id",
            "created_by",
            "created_at",
            "updated_at",
            "parent_organization",
            "parent_project",
            "created_by_username",
            "absolute_path",
            "file_size",
            "source_file",
            "source_query",
            "name"
        )

        fields = read_only_fields


class DatabaseSourceSerializer(serializers.ModelSerializer):
    created_by_username = serializers.ReadOnlyField(source="created_by.username")
    settings = serializers.JSONField(write_only=True)

    read_only_settings = serializers.SerializerMethodField(read_only=True)

    def get_read_only_settings(self, db):
        print("db", db)
        settings = views.json_settings_decrypt(
            db.db_settings
        )  # if "settings" not in db else db["settings"]
        settings["password"] = "-" * len(settings["password"])
        return settings

    class Meta:
        model = models.DatabaseSource
        read_only_fields = (
            "id",
            "created_by",
            "created_at",
            "updated_at",
            "parent_organization",
            "created_by_username",
            "read_only_settings",
        )

        fields = (
            "id",
            "created_by",
            "created_at",
            "updated_at",
            "parent_organization",
            "created_by_username",
            "name",
            "db_type",
            "settings",
            "read_only_settings",
        )

        extra_kwargs = {"settings": {"write_only": True}}

    def validate(self, data):
        print("validate", data)
        pg = PostgresQueryRunner(data.get("settings"))
        connection_data, error = pg.test_connection()
        if connection_data is None:
            raise serializers.ValidationError(error)
        return data


class QuerySerializer(serializers.ModelSerializer):
    created_by_username = serializers.ReadOnlyField(source="created_by.username")
    parent_database_source_name = serializers.ReadOnlyField(
        source="parent_database_source.name"
    )
    result_preview_data = serializers.SerializerMethodField(read_only=True)

    def get_result_preview_data(self, query):
        if not hasattr(query, 'dataframe'):
            return {}
        return json.loads(query.dataframe.preview_data)

    class Meta:
        model = models.Query
        read_only_fields = (
            "id",
            "created_by",
            "created_at",
            "updated_at",
            "parent_organization",
            "parent_project",
            "created_by_username",
            "parent_database_source_name",
            "status",
            #"result_dataframe",
            "result_preview_data",
            "started_at",
        )
        fields = (
            "id",
            "created_by",
            "created_at",
            "updated_at",
            "parent_organization",
            "parent_project",
            "created_by_username",
            "name",
            "query_text",
            "parent_database_source",
            "parent_database_source_name",
            "saved",
            "status",
            #"result_dataframe",
            "result_preview_data",
            "started_at",
        )
