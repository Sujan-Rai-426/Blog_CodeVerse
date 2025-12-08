from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from django.core.mail import send_mail


# ========================================================
#                  Send Emial OTP
# ========================================================

def send_otp_email(email, otp):
    subject = "Your OTP for Account Verification"
    message = f"Your OTP code is {otp}. It is valid for 10 minutes."
    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [email])




# ========================================================
#                  JWT COOKIE UTILITY
# ========================================================

def set_jwt_cookies(response, user, is_admin=False):
    """
    Set JWT access and refresh tokens in HttpOnly cookies.
    Works for dev (localhost) and production (HTTPS, cross-domain).
    """
    refresh = RefreshToken.for_user(user)
    access = str(refresh.access_token)

    # Decide cookie domain & security dynamically
    if settings.DEBUG:
        cookie_secure = False
        cookie_samesite = "Lax"
        cookie_domain = None
    else:
        cookie_secure = True
        cookie_samesite = "None"  # Needed for cross-site cookies
        cookie_domain = settings.BACKEND_PROD_DOMAIN

    # Choose cookie names based on user/admin
    access_cookie_name = settings.ADMIN_JWT_ACCESS_TOKEN if is_admin else settings.USER_JWT_ACCESS_TOKEN
    refresh_cookie_name = settings.ADMIN_JWT_REFRESH_TOKEN if is_admin else settings.USER_JWT_REFRESH_TOKEN

    # Access token cookie (short-lived)
    response.set_cookie(
        key=access_cookie_name,
        value=access,
        httponly=True,
        secure=cookie_secure,
        samesite=cookie_samesite,
        domain=cookie_domain,
        max_age=5*60,  # 5 minutes
    )

    # Refresh token cookie (long-lived)
    response.set_cookie(
        key=refresh_cookie_name,
        value=str(refresh),
        httponly=True,
        secure=cookie_secure,
        samesite=cookie_samesite,
        domain=cookie_domain,
        max_age=14*24*60*60,  # 14 days
    )

    return response
