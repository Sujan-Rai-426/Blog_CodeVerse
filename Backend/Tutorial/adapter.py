# from contextlib import suppress
# from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
# from rest_framework_simplejwt.tokens import RefreshToken
# from django.conf import settings

# class MySocialAccountAdapter(DefaultSocialAccountAdapter):
#     # Tutorial/adapter.py
#     def authentication_success_url(self, request):
#         with suppress(Exception):
#             request.session.flush()

#         user = request.user
#         refresh = RefreshToken.for_user(user)
#         access_token = str(refresh.access_token)

#         # Redirect to React handler that stores token
#         frontend = settings.LOGIN_REDIRECT_URL  # e.g., "http://localhost:5173/accounts/social-login-redirect"
#         return f"{frontend}?token={access_token}"


#     # Backup for older providers
#     def get_login_redirect_url(self, request):
#         return self.authentication_success_url(request)
