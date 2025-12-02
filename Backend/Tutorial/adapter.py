from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings

# Tutorial/adapter.py
class MySocialAccountAdapter(DefaultSocialAccountAdapter):
    def is_auto_signup_allowed(self, request, sociallogin):
        # Always auto-signup if user has email or username
        return True

    def populate_user(self, request, sociallogin, data):
        user = super().populate_user(request, sociallogin, data)
        # Force username/email to exist
        if not user.username:
            user.username = data.get("login") or "githubuser"
        if not user.email:
            user.email = f"{user.username}@example.com"
        return user

    def save_user(self, request, sociallogin, form=None):
        """Save user immediately to bypass mediator signup page"""
        user = sociallogin.user
        user.set_unusable_password()  # optional
        user.save()
        sociallogin.save(request)
        return user

    def get_login_redirect_url(self, request):
        # Only called after full login
        user = request.user
        if user.is_authenticated:
            from rest_framework_simplejwt.tokens import RefreshToken
            refresh = RefreshToken.for_user(user)
            token = str(refresh.access_token)
            frontend_url = getattr(settings, "LOGIN_REDIRECT_URL", "/")
            return f"{frontend_url}?token={token}"
        return getattr(settings, "LOGIN_REDIRECT_URL", "/")
