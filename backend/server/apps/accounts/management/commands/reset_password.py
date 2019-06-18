import getpass
import json
import six
from django.core.management.base import BaseCommand
from django.utils import timezone
from accounts.models import MljarUser
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError


class Command(BaseCommand):
    help = "Reset user password"

    def handle(self, *args, **kwargs):
        print("You are going to reset password in your own MLJAR installation.")
        try:
            for u in MljarUser.objects.all():
                print("User: {0} email: {1}".format(u.username, u.email))
                print("Please provide new password")
                pswd = getpass.getpass("Password:")
                validate_password(pswd)
                u.set_password(pswd)
                u.save()
        except ValidationError as e:
            print("-" * 70)
            print("There were errors during password reset for you:")
            for v in e:
                print("[ERROR] {0}".format(v))
            print("Please correct the errors and try again")
