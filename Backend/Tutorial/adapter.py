# Tutorial/adapter.py
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from django.shortcuts import redirect

class MySocialAccountAdapter(DefaultSocialAccountAdapter):
    def is_auto_signup_allowed(self, request, sociallogin):
        return True

    def is_open_for_signup(self, request, sociallogin):
        return True

    def populate_user(self, request, sociallogin, data):
        user = super().populate_user(request, sociallogin, data)
        if not user.username:
            user.username = data.get("login") or f"githubuser{sociallogin.account.uid}"
        if not user.email:
            user.email = f"{user.username}@example.com"
        return user

    def save_user(self, request, sociallogin, form=None):
        user = sociallogin.user
        user.set_unusable_password()
        user.save()
        sociallogin.save(request)
        return user

    def get_login_redirect_url(self, request, sociallogin=None):
        user = sociallogin.user if sociallogin else request.user
        frontend_url = getattr(settings, "LOGIN_REDIRECT_URL", "http://localhost:5173/User/Profile")
        if user.is_authenticated:
            # Generate JWT
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)

            # Set HttpOnly cookies
            response = redirect(frontend_url)
            response.set_cookie(
                key=settings.JWT_AUTH_COOKIE,
                value=access_token,
                httponly=True,
                secure=not settings.DEBUG,
                samesite="Lax" if settings.DEBUG else "None",
            )
            response.set_cookie(
                key=settings.JWT_AUTH_REFRESH_COOKIE,
                value=refresh_token,
                httponly=True,
                secure=not settings.DEBUG,
                samesite="Lax" if settings.DEBUG else "None",
            )
            return response

        return frontend_url
