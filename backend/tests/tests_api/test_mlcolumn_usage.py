import unittest
import requests

from tests.test_base import TestBase
from apps.ml.models import MLColumnsUsage


class TestMLColumnUsage(TestBase):
    def test_create_mlcolumn_usage(self):
        token = self.create_user_and_login(self.user1_params)
        project = self.create_project()

        self.assertEqual(
            len(MLColumnsUsage.objects.all()), 0
        )  # before starting it should be empty

        payload = {
            "title": "New cols usage",
            "columns_usage": {
                "target": ["target"],
                "input": ["feature_{}".format(i) for i in range(5)],
            },
        }

        cols_usage = self.request(
            "post",
            "/api/v1/{0}/{1}/ml_columns_usage".format(
                self.user1_params["organization_slug"], project.id
            ),
            payload,
            token,
            201,
        )
        self.assertEqual(len(MLColumnsUsage.objects.all()), 1)  # should be 1 usage
        self.assertEqual(cols_usage["title"], payload["title"])


if __name__ == "__main__":
    unittest.main()
