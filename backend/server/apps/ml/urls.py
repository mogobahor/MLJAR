from django.conf.urls import url, include

from apps.ml.views import MLColumnsUsageViewSet
from apps.ml.views import MLExperimentViewSet
from apps.ml.views import MLModelViewSet
from apps.ml.views import MLBatchPredictionViewSet

from rest_framework.routers import DefaultRouter

router = DefaultRouter(trailing_slash=False)
router.register(
    r"(?P<organization_slug>.+)/(?P<project_id>.+)/ml_columns_usage",
    MLColumnsUsageViewSet,
    basename="ml_columns_usage",
)

router.register(
    r"(?P<organization_slug>.+)/(?P<project_id>.+)/ml_experiments",
    MLExperimentViewSet,
    basename="ml_experiments",
)

router.register(
    r"(?P<organization_slug>.+)/(?P<project_id>.+)/ml_models",
    MLModelViewSet,
    basename="ml_models",
)

router.register(
    r"(?P<organization_slug>.+)/(?P<project_id>.+)/ml_batch_predictions",
    MLBatchPredictionViewSet,
    basename="ml_batch_predictions",
)

urlpatterns = [url(r"^api/v1/", include(router.urls))]
