# Tutorial/adapter.py
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from django.shortcuts import redirect

class MySocialAccountAdapter(DefaultSocialAccountAdapter):
    def is_auto_signup_allowed(self, request, sociallogin):
        """
        Always allow auto signup to skip mediator page.
        """
        return True

    def populate_user(self, request, sociallogin, data):
        """
        Make sure user has username and email
        """
        user = super().populate_user(request, sociallogin, data)
        if not user.username:
            user.username = data.get("login") or "githubuser"
        if not user.email:
            user.email = f"{user.username}@example.com"
        return user

    def save_user(self, request, sociallogin, form=None):
        """
        Save the user immediately to skip mediator.
        """
        user = sociallogin.user
        user.set_unusable_password()  # optional
        user.save()
        sociallogin.save(request)
        return user

    def get_login_redirect_url(self, request):
        """
        Redirect user immediately after login with JWT token.
        """
        user = request.user
        frontend_url = getattr(settings, "LOGIN_REDIRECT_URL", "http://localhost:5173/User/Profile")

        if user.is_authenticated:
            # Generate JWT token
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            # Redirect to frontend profile page with token
            return f"{frontend_url}?token={access_token}"

        # fallback
        return frontend_url
