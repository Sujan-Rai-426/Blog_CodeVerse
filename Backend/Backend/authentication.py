from django.conf import settings
from rest_framework_simplejwt.authentication import JWTAuthentication

class ClientCookieJWTAuthentication(JWTAuthentication):
    """
    Reads the access token directly from the 'access_user_token' HttpOnly cookie.
    """
    def authenticate(self, request):
        raw_token = request.COOKIES.get(settings.USER_JWT_ACCESS_TOKEN)
        if raw_token is None:
            return None  # No token, so let DRF return 401
        validated_token = self.get_validated_token(raw_token)
        return self.get_user(validated_token), validated_token


# Backend/authentication.py
from rest_framework_simplejwt.authentication import JWTAuthentication

class AdminCookieJWTAuthentication(JWTAuthentication):
    """
    Reads the access token directly from the 'access_admin_token' HttpOnly cookie.
    """
    def authenticate(self, request):
        raw_token = request.COOKIES.get(settings.ADMIN_JWT_ACCESS_TOKEN)
        if raw_token is None:
            return None  # Let DRF handle 401
        validated_token = self.get_validated_token(raw_token)
        return self.get_user(validated_token), validated_token
