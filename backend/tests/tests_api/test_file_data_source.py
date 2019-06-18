import unittest
import os
import copy
import requests
from tests.test_base import TestBase


class TestFileDataSource(TestBase):
    def setUp(self):
        super(TestFileDataSource, self).setUp()
        # set user and project
        self.token = self.create_user_and_login(self.user1_params)
        self.headers = {"Authorization": "Token " + self.token}
        # add project
        payload = {"title": "New project", "description": "Completely new"}
        self.project = self.request(
            "post",
            "/api/v1/{0}/projects".format(self.user1_params["organization_slug"]),
            payload,
            self.token,
            201,
        )

    def test_upload_and_api_create(self):
        # first we need to upload data file (create a data source)
        r = requests.get(
            "{0}/api/v1/{1}/{2}/{3}/upload_destination".format(
                self.get_server_url(),
                self.user1_params["organization_slug"],
                self.project["id"],
                "test-1.txt",
            ),
            headers=self.headers,
        )
        absolute_path = r.json()["absolute_path"]
        relative_dir = r.json()["relative_dir"]
        filename = r.json()["filename"]

        path = "/tmp/test_file.txt"
        f = open(path, "w")
        for i in range(1):
            f.write("1,1,1,1,1\n")
        f.close()
        file_size = os.path.getsize(path)  # in bytes
        with open(path, "rb") as fin:
            r = requests.put(
                "{0}/api/v1/{1}/{2}/{3}/upload".format(
                    self.get_server_url(),
                    self.user1_params["organization_slug"],
                    relative_dir,
                    filename,
                ),
                data=fin.read(),
                headers=self.headers,
            )
            self.assertEqual(r.status_code, 201)
        # add data source with uploaded file destination
        payload = {
            "title": "new file",
            "description": "a new file for training",
            "absolute_path": absolute_path,
            "file_size": file_size,
            "file_name": filename,
        }
        file_source = self.request(
            "post",
            "/api/v1/{0}/{1}/file_sources".format(
                self.user1_params["organization_slug"], self.project["id"]
            ),
            payload,
            self.token,
            201,
        )
        self.assertEqual(file_source["title"], payload["title"])


if __name__ == "__main__":
    unittest.main()
