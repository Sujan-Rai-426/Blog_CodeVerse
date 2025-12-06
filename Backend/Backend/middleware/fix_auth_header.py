# Backend/middleware/fix_auth_header.py
"""
FixAuthorizationHeaderMiddleware

Purpose:
- Ensures the `Authorization` header is preserved when hosting on serverless platforms
    (like Vercel) that may rename or strip headers.
- If `HTTP_AUTHORIZATION` is missing, it restores it from `HTTP_X_FORWARDED_AUTHORIZATION`.
- Helps avoid authentication failures due to missing or altered headers.

Usage:
- Optional, mostly needed when deploying to platforms that forward headers differently.
- Not required for local development but recommended for production on Vercel/Netlify.
"""
class FixAuthorizationHeaderMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Restore Authorization header if Vercel forwarded it differently
        if "HTTP_AUTHORIZATION" not in request.META:
            if auth := request.META.get("HTTP_X_FORWARDED_AUTHORIZATION"):
                request.META["HTTP_AUTHORIZATION"] = auth
        return self.get_response(request)
