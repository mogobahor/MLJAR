from django.conf import settings
from django.contrib import admin
from django.urls import path
from django.conf.urls import url, include

from apps.accounts.urls import urlpatterns as accounts_urlpatterns
from apps.projects.urls import urlpatterns as projects_urlpatterns
from apps.datasources.urls import urlpatterns as datasources_urlpatterns
from apps.ml.urls import urlpatterns as ml_urlpatterns
from storage.basic_storage_urls import upload_urlpatterns
from rest_framework.documentation import include_docs_urls

urlpatterns = [
    path("admin/", admin.site.urls),
    url(r"^docs/", include_docs_urls(title="MLJAR API Docs")),
]

urlpatterns += accounts_urlpatterns
urlpatterns += projects_urlpatterns
urlpatterns += datasources_urlpatterns
urlpatterns += upload_urlpatterns
urlpatterns += ml_urlpatterns

if settings.DEBUG:
    from django.conf.urls.static import static

    # Serve static and media files from development server
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

admin.site.site_header = "MLJAR Admin"
