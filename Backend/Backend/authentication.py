# Backend/authentication.py
from rest_framework_simplejwt.authentication import JWTAuthentication

class JWTFromCookieAuthentication(JWTAuthentication):
    """
    Custom JWT authentication that reads the token from HttpOnly cookies
    instead of the Authorization header.
    """
    def get_raw_token(self, request):
        """
        Override to get the token from cookies instead of headers.
        """
        # Make sure request is a proper HttpRequest
        if hasattr(request, "COOKIES"):
            return request.COOKIES.get("access_token")
        return None
