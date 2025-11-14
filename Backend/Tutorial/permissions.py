from rest_framework.permissions import SAFE_METHODS, BasePermission

class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        # SAFE for GET, HEAD, OPTIONS
        if request.method in SAFE_METHODS:
            return True

        # Only allow admins for POST, PUT, DELETE
        return request.user and request.user.is_authenticated and request.user.is_superuser
