import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework import generics
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status

from django.core.cache import cache
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model
from django.conf import settings

from Backend.authentication import ClientCookieJWTAuthentication, AdminCookieJWTAuthentication


# Load env variables
FRONTEND_DEV_DOMAIN = os.getenv("FRONTEND_DEV_DOMAIN", "localhost")
BACKEND_DEV_DOMAIN = os.getenv("BACKEND_DEV_DOMAIN", "localhost")
FRONTEND_PROD_DOMAIN = os.getenv("FRONTEND_PROD_DOMAIN")
BACKEND_PROD_DOMAIN = os.getenv("BACKEND_PROD_DOMAIN")

from .serializers import (
    AdminUserCreateSerializer,
    AdminUserDetailSerializer,
    AdminUserListSerializer,
    AdminUserUpdateSerializer,
    ClientRegisterSerializer,
    ClientLoginSerializer,
    AdminLoginSerializer,
    UserProfileSerializer
)

User = get_user_model()


# ========================================================
                # CSRF Token 
# ===========================================================
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie

@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({"detail": "CSRF cookie set"})


# ============================================================
# Cookie Token Refresh View
# Reads refresh token directly from HttpOnly cookies (no JSON payload required)
# Works for both Admin and Client users
# ============================================================
class CookieTokenRefreshView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        is_admin = kwargs.get("is_admin", False)
        refresh_cookie_name = (
            settings.ADMIN_JWT_REFRESH_TOKEN if is_admin else settings.USER_JWT_REFRESH_TOKEN
        )
        access_cookie_name = (
            settings.ADMIN_JWT_ACCESS_TOKEN if is_admin else settings.USER_JWT_ACCESS_TOKEN
        )
        refresh_token = request.COOKIES.get(refresh_cookie_name)
        if not refresh_token:
            return Response({"error": "No refresh token found in cookies"}, status=400)
        try:
            refresh = RefreshToken(refresh_token)
            new_access = str(refresh.access_token)
            response = Response({"access": new_access}, status=200)

            # PROPER COOKIE SETTINGS
            if settings.DEBUG:
                cookie_samesite = "Lax"
                cookie_secure = False
                cookie_domain = None
            else:
                cookie_samesite = "None"
                cookie_secure = True
                cookie_domain = f".{BACKEND_PROD_DOMAIN}"

            # IMPORTANT: SET NEW ACCESS COOKIE HERE
            response.set_cookie(
                key=access_cookie_name,
                value=new_access,
                httponly=True,
                samesite=cookie_samesite,
                secure=cookie_secure,
                domain=cookie_domain,
                max_age=5 * 60,
            )
            return response
        except Exception:
            return Response({"error": "Invalid or expired refresh token"}, status=400)





# ============================================================
#                     ADMIN LOGIN
# ============================================================

class AdminLoginAPIView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        if not email or not password:
            return Response({"detail": "Email & password required"}, status=400)
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"detail": "Invalid credentials"}, status=401)
        if not user.check_password(password):
            return Response({"detail": "Invalid credentials"}, status=401)
        if not user.is_admin_user and not user.is_superuser:
            return Response({"detail": "Not authorized as admin"}, status=403)
        refresh = RefreshToken.for_user(user)
        response = Response({
            "message": "Admin login successful",
            "email": user.email
        })

        # Set cookies dynamically based on environment
        if settings.DEBUG:
            cookie_samesite = "Lax"
            cookie_secure = False
            cookie_domain = None
        else:
            cookie_samesite = "None"
            cookie_secure = True
            cookie_domain = f".{BACKEND_PROD_DOMAIN}"

        # Access token cookie (short-lived)
        response.set_cookie(
            key=settings.ADMIN_JWT_ACCESS_TOKEN,
            value=str(refresh.access_token),
            httponly=True,
            samesite=cookie_samesite,
            secure=cookie_secure,
            domain=cookie_domain,
            max_age=5*60,  # 5 minutes
        )

        # Refresh token cookie (long-lived)
        response.set_cookie(
            key=settings.ADMIN_JWT_REFRESH_TOKEN,
            value=str(refresh),
            httponly=True,
            samesite=cookie_samesite,
            secure=cookie_secure,
            domain=cookie_domain,
            max_age=7*24*60*60,  # 7 days
        )

        return response




# ============================================================
#                   ADMIN PROFILE
# ============================================================

class AdminProfileView(APIView):
    authentication_classes = [AdminCookieJWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)




# ============================================================
#                  ADMIN LOGOUT
# ============================================================

class AdminLogoutView(APIView):
    authentication_classes = [AdminCookieJWTAuthentication]
    permission_classes = [IsAdminUser]
    def post(self, request):
        response = Response({"message": "Admin logged out successfully"}, status=200)
        response.delete_cookie(settings.ADMIN_JWT_ACCESS_TOKEN)
        response.delete_cookie(settings.ADMIN_JWT_REFRESH_TOKEN)
        return response




# ============================================================
#                  ADMIN - ALL DATA FETCH
# ============================================================

class AdminAllDataAPIView(APIView):
    authentication_classes = [AdminCookieJWTAuthentication]
    permission_classes = [IsAdminUser]
    def get(self, request):
        # Cache for speed
        data = cache.get("admin_all_data")
        if data:
            return Response(data)

        # Import models here to avoid circular imports
        from Tutorial.models import (
            Category, Topic, Section, Language,
            Template, TemplateType,
            FrontendSourceCode, BackendStep, BackendImage
        )
        from Tutorial.serializers import (
            CategorySerializer, TopicSerializer, SectionSerializer,
            LanguageSerializer, TemplateSerializer, TemplateTypeSerializer,
            FrontendSourceCodeSerializer, BackendStepSerializer, BackendImageSerializer
        )
        data = {
            "categories": CategorySerializer(Category.objects.all(), many=True).data,
            "topics": TopicSerializer(Topic.objects.all(), many=True).data,
            "sections": SectionSerializer(Section.objects.all(), many=True).data,
            "languages": LanguageSerializer(Language.objects.all(), many=True).data,
            "templates": TemplateSerializer(Template.objects.all(), many=True).data,
            "template-types": TemplateTypeSerializer(TemplateType.objects.all(), many=True).data,
            "frontend-source-codes": FrontendSourceCodeSerializer(FrontendSourceCode.objects.all(), many=True).data,
            "backend_steps": BackendStepSerializer(BackendStep.objects.all(), many=True).data,
            "backend_images": BackendImageSerializer(BackendImage.objects.all(), many=True).data,
        }
        cache.set("admin_all_data", data, timeout=600)    # Cache 10 minutes
        return Response(data)




# ============================================================
#                  CLIENT REGISTER
# ============================================================

class ClientRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = ClientRegisterSerializer
    permission_classes = [AllowAny]



# ============================================================
#                   CLIENT LOGIN
# ============================================================

class ClientLoginView(APIView):
    def post(self, request):
        serializer = ClientLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        user = data["user"]
        tokens = data["tokens"]
        response = Response({
            "user": {
                "email": user.email,
                "username": user.username,
            },
            "message": "Login successful"
        }, status=status.HTTP_200_OK)

        # Dynamically set cookie attributes based on environment
        if settings.DEBUG:
            print("LOGIN COOKIE DOMAIN =>", f".{BACKEND_PROD_DOMAIN}")
            cookie_samesite = "Lax"
            cookie_secure = False
            cookie_domain = None
        else:
            cookie_samesite = "None"
            cookie_secure = True
            cookie_domain = f".{BACKEND_PROD_DOMAIN}"

        # Set access token cookie (short-lived)
        response.set_cookie(
            key=settings.USER_JWT_ACCESS_TOKEN,
            value=tokens["access"],
            httponly=True,
            samesite=cookie_samesite,
            secure=cookie_secure,
            domain=cookie_domain,
            max_age=5*60,  # 5 minutes
        )

        # Set refresh token cookie (long-lived)
        response.set_cookie(
            key=settings.USER_JWT_REFRESH_TOKEN,
            value=tokens["refresh"],
            httponly=True,
            samesite=cookie_samesite,
            secure=cookie_secure,
            domain=cookie_domain,
            max_age=7*24*60*60,  # 7 days
        )
        return response




# ============================================================
#                     CLIENT PROFILE
# ============================================================

class ClientProfileView(APIView):
    authentication_classes = [ClientCookieJWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)




# ============================================================
#                     CLIENT LOGOUT
# ============================================================

class ClientLogoutView(APIView):
    def post(self, request):
        refresh_token = request.COOKIES.get(settings.USER_JWT_REFRESH_TOKEN)
        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()  # requires 'rest_framework_simplejwt.token_blacklist' in INSTALLED_APPS
            except Exception:
                pass
        response = Response({"message": "Logged out"}, status=status.HTTP_200_OK)
        response.delete_cookie(settings.USER_JWT_ACCESS_TOKEN)
        response.delete_cookie(settings.USER_JWT_REFRESH_TOKEN)
        return response




# ===============================================================
#            Like Admin Pannel ---> User MANAGEMENT  
# ===============================================================
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from Backend.authentication import AdminCookieJWTAuthentication


User = get_user_model()

class AdminUserListAPIView(generics.ListAPIView):
    authentication_classes = [AdminCookieJWTAuthentication]
    permission_classes = [IsAdminUser]
    serializer_class = AdminUserListSerializer
    def get_queryset(self):
        qs = User.objects.all().order_by("-id")
        search = self.request.query_params.get("search")
        role = self.request.query_params.get("role")
        if search:
            qs = qs.filter(email__icontains=search) | qs.filter(username__icontains=search)
        if role == "admin":
            qs = qs.filter(is_admin_user=True)
        elif role == "client":
            qs = qs.filter(is_client=True)
        return qs


class AdminUserToggleActiveAPIView(APIView):
    authentication_classes = [AdminCookieJWTAuthentication]
    permission_classes = [IsAdminUser]
    def post(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
        user.is_active = not user.is_active
        user.save()
        return Response({
            "message": "User status updated",
            "is_active": user.is_active
        })


class AdminUserDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = [AdminCookieJWTAuthentication]
    permission_classes = [IsAdminUser]
    queryset = User.objects.all()
    lookup_field = "pk"
    def get_serializer_class(self):
        if self.request.method in ["PUT", "PATCH"]:
            return AdminUserUpdateSerializer
        return AdminUserDetailSerializer



class AdminUserCreateAPIView(generics.CreateAPIView):
    authentication_classes = [AdminCookieJWTAuthentication]
    permission_classes = [IsAdminUser]
    serializer_class = AdminUserCreateSerializer

