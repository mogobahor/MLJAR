from rest_framework import permissions

from apps.accounts.models import Membership


class IsAuthenticatedAndFromOrganization(permissions.BasePermission):
    message = "You must have organization membership to access this object"

    def has_permission(self, request, view):
        print("has_permission", view.kwargs, request.method in permissions.SAFE_METHODS)
        # is authenticated
        if (request.user is None) or (not request.user.is_authenticated):
            return False
        # get organization slug
        organization_slug = view.kwargs.get("organization_slug")
        if organization_slug is None:
            return False
        # check membership
        permissed_statuses = ["admin", "member"]
        if request.method in permissions.SAFE_METHODS:
            permissed_statuses += ["view"]
        print(Membership.objects.all())
        q = Membership.objects.filter(
            user=request.user,
            organization__slug=organization_slug,
            status__in=permissed_statuses,
        )
        print(q.exists())
        return q.exists()

    def has_object_permission(self, request, view, obj):
        print("has_object_permission", obj.created_by, request.user)
        # try:
        #    permissed_statuses = ["admin", "member"]
        #    if request.method in permissions.SAFE_METHODS:
        #        permissed_statuses += ["view"]

        #    Membership.objects.get(
        #        user=request.user,
        #        organization=obj.get("parent_organization"),
        #        status__in=permissed_statuses,
        #    )
        # except Membership.DoesNotExist:
        #    print("Membership does not exist")
        #    return False

        return True
