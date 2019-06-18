from django.conf.urls import url, include

from apps.datasources.views import (
    FileDataSourceViewSet,
    DataFrameViewSet,
    DatabaseSourceViewSet,
    GetDataFrameDetails,
    GetDataFramePreview,
    GetDataFrameColumns,
    QueryViewSet,
    ExecuteQueryView,
)
from rest_framework.routers import DefaultRouter

router = DefaultRouter(trailing_slash=False)
router.register(
    r"(?P<organization_slug>.+)/(?P<project_id>.+)/file_sources",
    FileDataSourceViewSet,
    basename="file_sources",
)
router.register(
    r"(?P<organization_slug>.+)/(?P<project_id>.+)/dataframes",
    DataFrameViewSet,
    basename="dataframes",
)
router.register(
    r"(?P<organization_slug>.+)/database_source",
    DatabaseSourceViewSet,
    basename="database_source",
)
router.register(
    r"(?P<organization_slug>.+)/(?P<project_id>.+)/query",
    QueryViewSet,
    basename="query",
)

urlpatterns = [
    url(r"^api/v1/", include(router.urls)),
    url(
        r"^api/v1/(?P<organization_slug>.+)/(?P<project_id>.+)/dataframe_preview/(?P<dataframe_id>.+)",
        GetDataFramePreview.as_view(),
        name="dataframe_preview",
    ),
    url(
        r"^api/v1/(?P<organization_slug>.+)/(?P<project_id>.+)/dataframe_details/(?P<dataframe_id>.+)",
        GetDataFrameDetails.as_view(),
        name="dataframe_details",
    ),
    url(
        r"^api/v1/(?P<organization_slug>.+)/(?P<project_id>.+)/dataframe_columns/(?P<dataframe_id>.+)",
        GetDataFrameColumns.as_view(),
        name="dataframe_columns",
    ),
    url(
        r"^api/v1/(?P<organization_slug>.+)/(?P<project_id>.+)/execute_query/(?P<query_id>.+)",
        ExecuteQueryView.as_view(),
        name="execute_query",
    ),
]
