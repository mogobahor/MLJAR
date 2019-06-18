import os
import sys
import unittest
import requests
import uuid
import time

BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SERVER_DIR = os.path.join(BACKEND_DIR, "server")
sys.path.insert(0, SERVER_DIR)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "server.settings")
import django

django.setup()
from django.urls import reverse
from apps.accounts.models import MljarUser, Organization, Membership
from apps.projects.models import Project
from apps.datasources.models import FileDataSource, DataFrame
from apps.ml.models import MLColumnsUsage, MLExperiment, MLModel

from tests.data.example import example_X, example_y, data_to_file

from worker import consumer


class TestBase(unittest.TestCase):
    def setUp(self):
        print("-"*50)
        rnd = str(uuid.uuid4())[:4]
        for c in ["username", "email", "organization", "organization_slug"]:
            self.user1_params[c] = self.init_user_params[c] + rnd
        print(self.user1_params)


    def tearDown(self):
        try:
            #consumer.WORKERS.control.purge()
            # clear database tables before running a test
            self.clear_database()
        except Exception as e:
            print("Problem with database clear", str(e))
            time.sleep(3) # try one more time after some wait
            self.clear_database()

    def clear_database(self):
        for d in [
            MLModel,
            MLExperiment,
            MLColumnsUsage,
            DataFrame,
            FileDataSource,
            Project,
            Organization,
            MljarUser,
            Membership,
        ]:
            d.objects.all().delete()

    init_user_params = {
        "username": "piotrek",
        "email": "piotrek@piotrek.pl",
        "password": "verysecret",
        "organization": "personal",
        "organization_slug": "personal",
    }

    user1_params = {
        "username": "piotrek",
        "email": "piotrek@piotrek.pl",
        "password": "verysecret",
        "organization": "personal",
        "organization_slug": "personal",
    }

    user2_params = {
        "username": "piotrek2",
        "email": "piotrek2@piotrek2.pl",
        "password": "verysecret2",
        "organization": "big co2",
        "organization_slug": "big-co2",
    }

    def get_server_url(self):
        return os.environ.get("SERVER_URL", "http://0.0.0.0:8000")

    def create_user_and_login(self, payload):
        r = requests.post(self.get_server_url() + reverse("user_create"), json=payload)
        # if r.status_code != 204:
        #    print(r.status_code, r.text)
        # we are not checking here the response status code, because maybe user already exists in db
        r = requests.post(self.get_server_url() + reverse("login"), json=payload)
        if r.status_code != 200:
            print(r.text)
        self.assertEqual(r.status_code, 200)
        token = r.json().get("auth_token")
        return token

    def create_project(self):
        organization = Organization.objects.get(
            slug=self.user1_params["organization_slug"]
        )
        user = MljarUser.objects.get(email=self.user1_params["email"])
        project = Project(
            title="some title",
            description="...",
            created_by=user,
            parent_organization=organization,
        )
        project.save()
        return project

    def create_data_frame(self, project):
        data_path = "./example_data_for_tests_only.csv"
        data_to_file(example_X, example_y, data_path)
        organization = Organization.objects.get(
            slug=self.user1_params["organization_slug"]
        )
        user = MljarUser.objects.get(email=self.user1_params["email"])
        df = DataFrame(
            absolute_path=data_path,
            file_size=1,
            created_by=user,
            parent_organization=organization,
            parent_project=project,
        )
        df.save()
        return df

    def create_ml_columns_usage(self, project):
        organization = Organization.objects.get(
            slug=self.user1_params["organization_slug"]
        )
        user = MljarUser.objects.get(email=self.user1_params["email"])
        ml_columns_usage = MLColumnsUsage(
            title="New cols usage",
            columns_usage={
                "target": ["target"],
                "input": ["feature_{}".format(i) for i in range(5)],
            },
            created_by=user,
            parent_organization=organization,
            parent_project=project,
        )
        ml_columns_usage.save()
        return ml_columns_usage

    def create_ml_experiment(self, token, project, data_frame, ml_columns_usage):
        payload = {
            "title": "New experiment",
            "description": "Completely new",
            "params": {
                "metric": {"optimize": "logloss", "monitor": ["logloss"]},
                "validation": {
                    "validation_type": "split",
                    "train_ratio": 0.8,
                    "shuffle": True,
                },
                "preprocessing": {},
            },
            "parent_columns_usage": ml_columns_usage.id,
            "parent_training_dataframe": data_frame.id,
        }
        # it needs to be done with REST api because of workers initialization
        # in the MLExperimentViewSet
        ml_experiment = self.request(
            "post",
            "/api/v1/{0}/{1}/ml_experiments".format(
                self.user1_params["organization_slug"], project.id
            ),
            payload,
            token,
            201,
        )
        return ml_experiment

    def request(self, method, endpoint, payload, token, expected_status_code=200):
        headers = {"Authorization": "Token " + token} if token else {}
        if method.lower() == "post":
            r = requests.post(
                self.get_server_url() + endpoint, json=payload, headers=headers
            )
        elif method.lower() == "delete":
            r = requests.delete(self.get_server_url() + endpoint, headers=headers)
        elif method.lower() == "put":
            r = requests.delete(self.get_server_url() + endpoint, headers=headers)
        else:
            r = requests.get(self.get_server_url() + endpoint, headers=headers)
        if r.status_code != expected_status_code:
            print(r.status_code, r.text)
        self.assertEqual(r.status_code, expected_status_code)
        if expected_status_code in [200, 201]:
            return r.json()
