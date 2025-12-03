from django.conf import settings

class JWTFromCookieMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):

        # For user OAuth login
        access = request.COOKIES.get(settings.USER_JWT_AUTH_COOKIE)

        if access:
            request.META["HTTP_AUTHORIZATION"] = f"Bearer {access}"

        return self.get_response(request)
