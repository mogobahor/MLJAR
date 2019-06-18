from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import MljarUser

admin.site.register(MljarUser, UserAdmin)
