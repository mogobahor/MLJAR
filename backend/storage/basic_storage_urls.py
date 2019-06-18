from django.conf.urls import url
from storage.basic_storage_views import FileUploadView, FileUploadDestinationView

upload_urlpatterns = [
    url(
        r"^api/v1/(?P<organization_slug>.+)/(?P<relative_dir>.+)/(?P<filename>.+)/upload$",
        FileUploadView.as_view(),
        name="file_upload",
    ),
    url(
        r"^api/v1/(?P<organization_slug>.+)/(?P<project_id>.+)/(?P<filename>.+)/upload_destination$",
        FileUploadDestinationView.as_view(),
        name="file_upload_destination",
    ),
]
