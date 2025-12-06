


# Tutorial/utils.py
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings

def set_jwt_cookies(response, user):
    """
    Set JWT access and refresh tokens in HttpOnly cookies.
    Works for dev (localhost) and production (HTTPS).
    """
    refresh = RefreshToken.for_user(user)
    access = str(refresh.access_token)

    # Access token cookie
    response.set_cookie(
        key=settings.USER_JWT_AUTH_COOKIE,
        value=access,
        httponly=True,              # JS cannot read
        secure=False,               # False for localhost
        samesite="Lax",             # Lax works for localhost
        max_age=5*60                # 5 minutes
    )

    # Refresh token cookie
    response.set_cookie(
        key=settings.USER_JWT_AUTH_REFRESH_COOKIE,
        value=str(refresh),
        httponly=True,
        secure=False,
        samesite="Lax",
        max_age=14*24*60*60         # 14 days
    )

    return response
