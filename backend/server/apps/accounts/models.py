from django.db import models

from django.contrib.auth.validators import UnicodeUsernameValidator

from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser

from django.utils.timezone import now
from django.template.defaultfilters import slugify

from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from apps.common.fields import AutoCreatedField
from apps.common.fields import AutoLastModifiedField


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)
        tokens = Token.objects.all()


class MljarUserManager(BaseUserManager):
    def create_user(self, email, password=None, username=None):
        if not email:
            raise ValueError("Users must have an email address")
        user = self.model(email=self.normalize_email(email), username=username)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password):
        user = self.create_user(email, password=password, username="superuser")
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class Organization(models.Model):
    name = models.CharField(
        max_length=200,
        help_text="The name of the organization",
        blank=False,
        null=False,
        validators=[UnicodeUsernameValidator()],
    )
    slug = models.CharField(
        max_length=200,
        unique=True,
        blank=False,
        null=False,
        validators=[UnicodeUsernameValidator()],
    )
    is_active = models.BooleanField(default=True)

    created_at = AutoCreatedField()
    updated_at = AutoLastModifiedField()

    def save(self, *args, **kwargs):
        # Newly created object, so set slug
        if not self.id:
            self.slug = slugify(self.name)
        super(Organization, self).save(*args, **kwargs)


class MljarUser(AbstractUser):
    email = models.EmailField(
        blank=False, max_length=254, verbose_name="email address", unique=True
    )
    username = models.CharField(
        help_text="Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.",
        max_length=150,
        unique=False,
        validators=[UnicodeUsernameValidator()],
        verbose_name="username",
    )

    organizations = models.ManyToManyField(Organization, through="Membership")

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []
    objects = MljarUserManager()

    def delete(self, *args, **kwargs):
        super().delete(*args, **kwargs)


class Membership(models.Model):
    statuses = (("admin", "Admin"), ("view", "View only"), ("member", "Member"))
    user = models.ForeignKey(MljarUser, on_delete=models.CASCADE)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    status = models.CharField(
        max_length=32, choices=statuses, default="view", blank=False
    )
    created_at = AutoCreatedField()
    updated_at = AutoLastModifiedField()
