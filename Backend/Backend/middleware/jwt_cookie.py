"""
JWTFromCookieMiddleware

Purpose:
- Reads the JWT access token stored in HttpOnly cookies (USER_JWT_ACCESS_TOKEN / ADMIN_JWT_ACCESS_TOKEN).
- Sets the token into the `Authorization` header (HTTP_AUTHORIZATION) so Django REST Framework (DRF) 
    and SimpleJWT can authenticate requests.
- Essential for cookie-based authentication where JavaScript cannot read the HttpOnly token.

Usage:
- Required for DRF views that rely on JWT from HttpOnly cookies instead of localStorage.
- Works for both user and admin authentication if cookies are set correctly.
"""

from django.conf import settings

class JWTFromCookieMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):

        # For user OAuth login
        access = request.COOKIES.get(settings.USER_JWT_ACCESS_TOKEN)

        if access:
            request.META["HTTP_AUTHORIZATION"] = f"Bearer {access}"

        return self.get_response(request)
