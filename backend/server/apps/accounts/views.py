import requests

from django.shortcuts import render

from rest_framework import views
from rest_framework.response import Response

from django.urls import reverse

from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.urls.exceptions import NoReverseMatch
from django.utils.timezone import now
from rest_framework import generics, permissions, status, views, viewsets
from rest_framework.decorators import list_route
from rest_framework.response import Response
from rest_framework.reverse import reverse

from djoser import utils, signals
from djoser.compat import get_user_email, get_user_email_field_name
from djoser.conf import settings as djoser_settings


from rest_framework import generics, permissions, status, views, viewsets

from apps.accounts.models import Organization

from apps.accounts.serializers import OrganizationSerializer

from djoser.serializers import UserCreateSerializer


class MljarUserOrganizationList(generics.ListAPIView):
    serializer_class = OrganizationSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        return Organization.objects.filter(mljaruser=user)


class MljarUserCreateView(generics.CreateAPIView):
    """
    Use this endpoint to register new user.
    """

    serializer_class = djoser_settings.SERIALIZERS.user_create
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        user = serializer.save()
        signals.user_registered.send(
            sender=self.__class__, user=user, request=self.request
        )

        context = {"user": user}
        to = [get_user_email(user)]
        if djoser_settings.SEND_ACTIVATION_EMAIL:
            djoser_settings.EMAIL.activation(self.request, context).send(to)
        elif djoser_settings.SEND_CONFIRMATION_EMAIL:
            djoser_settings.EMAIL.confirmation(self.request, context).send(to)
