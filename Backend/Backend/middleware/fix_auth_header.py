# Backend/middleware/fix_auth_header.py

class FixAuthorizationHeaderMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Restore Authorization header if Vercel forwarded it differently
        if "HTTP_AUTHORIZATION" not in request.META:
            if auth := request.META.get("HTTP_X_FORWARDED_AUTHORIZATION"):
                request.META["HTTP_AUTHORIZATION"] = auth
        return self.get_response(request)
