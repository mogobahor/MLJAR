import getpass
import json
import six
from django.core.management.base import BaseCommand
from django.utils import timezone
from apps.accounts.models import MljarUser
from apps.accounts.serializers import MljarUserCreateSerializer
from rest_framework.serializers import ValidationError


class Command(BaseCommand):
    help = "Create user account"

    def create_account(self):
        try:
            print("-" * 70)
            print("What is your username?")
            username = "piotr"  # input()
            print(username)
            print("What is your email?")
            email = "piotrek@piotrek.pl"  # input()
            print(email)
            print("Please set password")
            pswd = "verysecret"  # getpass.getpass("Password:")
            print("I know,", pswd)

            payload = {
                "email": email,
                "username": username,
                "password": pswd,
                "organization": "personal",
            }
            user_serializer = MljarUserCreateSerializer(data=payload)
            user_serializer.is_valid(raise_exception=True)
            user_serializer.save()
            print("[DONE] User created successfuly")
            return True
        except ValidationError as e:
            print("-" * 70)
            print("There were errors while creating account for you:")
            for k, v in e.detail.items():
                print("[ERROR] {0}".format(v[0]))
            print("Please correct the errors and try again")

        return False

    def handle(self, *args, **kwargs):
        if not MljarUser.objects.all().exists():
            print("Please set up your account in your own MLJAR installation.")
            success = self.create_account()
        else:
            print("There is already user created.")
            for user in MljarUser.objects.all():
                print("User:", user.email)
