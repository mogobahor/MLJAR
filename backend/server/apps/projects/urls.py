from django.conf.urls import url, include

from apps.projects.views import ProjectViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter(trailing_slash=False)
router.register(
    r"(?P<organization_slug>.+)/projects", ProjectViewSet, basename="projects"
)

urlpatterns = [url(r"^api/v1/", include(router.urls))]
