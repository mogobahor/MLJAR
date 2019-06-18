import os
import uuid
from rest_framework import views, status
from rest_framework.parsers import FileUploadParser
from rest_framework.response import Response
from rest_framework import status

from apps.common.permissions import IsAuthenticatedAndFromOrganization

from storage.storage import Storage


class FileUploadView(views.APIView):
    parser_classes = (FileUploadParser,)
    permission_classes = (IsAuthenticatedAndFromOrganization,)

    def put(self, request, organization_slug, relative_dir, filename, format=None):
        file_obj = request.data["file"]
        storage = Storage()
        absolute_path = storage.get_path(relative_dir, filename)
        with open(absolute_path, "wb+") as fout:
            for chunk in file_obj.chunks():
                fout.write(chunk)

        return Response(status=status.HTTP_201_CREATED)


class FileUploadDestinationView(views.APIView):
    permission_classes = (IsAuthenticatedAndFromOrganization,)

    def get(self, request, organization_slug, project_id, filename, format=None):

        filename = "input-{0}-{1}".format(filename, str(uuid.uuid4())[:8])
        relative_dir = "org_{0}_proj_{1}".format(organization_slug, project_id)
        relative_path = os.path.join(relative_dir, filename)
        absolute_path = Storage().get_path(relative_dir, filename)

        return Response(
            {
                "filename": filename,
                "relative_dir": relative_dir,
                "relative_path": relative_path,
                "absolute_path": absolute_path,
                "storage_type": "basic",
            }
        )
