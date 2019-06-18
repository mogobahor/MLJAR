from django.conf import settings
from django.contrib import admin
from django.urls import path
from django.conf.urls import url, include

from apps.accounts.views import MljarUserCreateView

from django.contrib.auth import get_user_model
from djoser.views import (
    SetPasswordView,
    PasswordResetView,
    PasswordResetConfirmView,
    UserDeleteView,
    UserView,
)
from rest_framework.routers import DefaultRouter
from apps.accounts.views import MljarUserOrganizationList

User = get_user_model()

urlpatterns = [
    url(r"^api/v1/users/create/?$", MljarUserCreateView.as_view(), name="user_create"),
    url(r"^api/v1/users/delete/?$", UserDeleteView.as_view(), name="user_delete"),
    url(r"^api/v1/users/password/?$", SetPasswordView.as_view(), name="set_password"),
    url(
        r"^api/v1/users/password/reset/?$",
        PasswordResetView.as_view(),
        name="password_reset",
    ),
    url(
        r"^api/v1/users/password/reset/confirm/?$",
        PasswordResetConfirmView.as_view(),
        name="password_reset_confirm",
    ),
    url(r"^api/v1/users/auth/", include("djoser.urls.authtoken")),
    url(r"^api/v1/users/me/?$", UserView.as_view(), name="user"),
    url(
        r"^api/v1/users/organization/?$",
        MljarUserOrganizationList.as_view(),
        name="user_organization",
    ),
]
