from rest_framework.authtoken.models import Token
from django.contrib.auth.models import AnonymousUser
from django.db import close_old_connections
from apps.accounts.models import Organization
from apps.accounts.models import Membership


class TokenAuthMiddleware:
    def __init__(self, inner):
        self.inner = inner

    def __call__(self, scope):
        print("token auth middle")
        if not scope["query_string"]:
            scope["user"] = AnonymousUser()
            return self.inner(scope)

        query = dict((x.split("=") for x in scope["query_string"].decode().split("&")))
        # print(query.get('token'), query.get("organization"))
        # User
        if query.get("token"):
            try:
                token = Token.objects.get(key=query.get("token"))
                scope["user"] = token.user
            except Token.DoesNotExist:
                scope["user"] = AnonymousUser()
        # Organization
        if query.get("organization"):
            try:
                print(">", scope["user"].organizations)
                scope["organization"] = Organization.objects.get(
                    slug=query.get("organization")
                )
            except Organization.DoesNotExist:
                scope["organization"] = None
        print(scope["user"], scope["organization"])

        q = Membership.objects.filter(
            user=scope["user"], organization__slug=query.get("organization")
        )
        print("q", q)
        if not q.exists():
            scope["user"], scope["organization"] = None, None
        print(scope["user"], scope["organization"])
        close_old_connections()
        return self.inner(scope)
