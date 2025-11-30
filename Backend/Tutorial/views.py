# Tutorial/views.py
from django.db import IntegrityError

from rest_framework.decorators import action
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny

# Tutorial/views.py
from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser

from django.contrib.auth import authenticate
from Backend import settings
from Tutorial.permissions import IsAdminOrReadOnly
from rest_framework.decorators import api_view

import re
from django.core.mail import EmailMessage, BadHeaderError
from Tutorial.utils import verify_email_exists

from datetime import timedelta
from django.utils import timezone
from django.core.cache import cache


from Tutorial.models import (
    Category, Section, Topic, Language,
    FrontendSourceCode,
    BackendStep, BackendImage, TemplateType, Template
)
from Tutorial.serializers import (
    CategorySerializer, SectionSerializer, TopicSerializer, LanguageSerializer,
    FrontendSourceCodeSerializer,
    BackendStepSerializer, BackendImageSerializer, TemplateTypeSerializer, TemplateSerializer
)

# ------------------ CATEGORY & TOPIC ------------------
class CategoryViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    queryset = Category.objects.all().prefetch_related("sections__languages__topics__source_codes")
    serializer_class = CategorySerializer

class TopicViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    queryset = Topic.objects.all().prefetch_related("source_codes", "steps", "images")
    serializer_class = TopicSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            self.perform_create(serializer)
        except IntegrityError:
            return Response(
                {"error": "A topic with this name already exists for the selected language."},
                status=status.HTTP_400_BAD_REQUEST
            )
        return Response(serializer.data, status=201)


# ---------------- SECTION -------------
class SectionViewSet(viewsets.ModelViewSet):
    queryset = Section.objects.all()
    serializer_class = SectionSerializer
    permission_classes = [IsAdminOrReadOnly] 


# ------------------ LANGUAGE ------------------
class LanguageViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    queryset = Language.objects.all()
    serializer_class = LanguageSerializer


# ------------------ FRONTEND SOURCE CODES ------------------
class FrontendSourceCodeViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    queryset = FrontendSourceCode.objects.all()
    serializer_class = FrontendSourceCodeSerializer

    def perform_create(self, serializer):
        # No special file upload here (we moved away from video frames).
        serializer.save()


# ------------------ BACKEND ------------------
class BackendStepViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    queryset = BackendStep.objects.all()
    serializer_class = BackendStepSerializer
    @action(detail=False, methods=["get"], url_path="occupied-steps/(?P<topic_id>[^/.]+)")
    def occupied_steps(self, request, topic_id=None):
        steps = BackendStep.objects.filter(topic_id=topic_id).values_list("step_number", flat=True)
        return Response({"occupied_steps": list(steps)}, status=status.HTTP_200_OK)


class BackendImageViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    queryset = BackendImage.objects.all()
    serializer_class = BackendImageSerializer




# ------------------ Contact form (unchanged) ------------------
EMAIL_REGEX = r"[^@]+@[^@]+\.[^@]+"

@api_view(['POST'])
def contact_form_view(request):
    name = request.data.get('name')
    email = request.data.get('email')
    subject = request.data.get('subject')
    message = request.data.get('message')

    if not name or not email or not subject or not message:
        return Response({"error": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)

    if not re.match(EMAIL_REGEX, email):
        return Response({"error": "Invalid email format."}, status=status.HTTP_400_BAD_REQUEST)

    if not verify_email_exists(email):
        return Response({"error": "The email address does not exist or cannot receive emails."},
                        status=status.HTTP_400_BAD_REQUEST)

    email_subject = f"Contact Form Message: {subject}"
    email_message = f"From: {name} <{email}>\n\nMessage:\n{message}"

    try:
        email_obj = EmailMessage(
            subject=email_subject,
            body=email_message,
            from_email='rsujan140.in@gmail.com',
            to=['rsujan140.in@gmail.com'],
            reply_to=[email]
        )
        email_obj.send(fail_silently=False)
        return Response({"message": "Message sent successfully!"}, status=status.HTTP_200_OK)
    except BadHeaderError:
        return Response({"error": "Invalid header found."}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": f"Failed to send email: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ------------------ TEMPLATE viewsets (unchanged) ------------------
class TemplateTypeViewSet(viewsets.ModelViewSet):
    queryset = TemplateType.objects.all()
    serializer_class = TemplateTypeSerializer
    permission_classes = [IsAdminOrReadOnly]


class TemplateViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    queryset = Template.objects.all().order_by("-created_at")
    serializer_class = TemplateSerializer



# ------------------ ADMIN LOGIN VIEW ------------------
class AdminLoginAPIView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user is not None and user.is_superuser:
            return self.create_token_response(user)
        else:
            return Response({"detail": "Invalid credentials or not admin."}, status=401)
    def create_token_response(self, user):
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        expires = timezone.now() + timedelta(days=7)
        response = Response({
            "detail": "Login successful",
            "access_token": access_token,
            "refresh_token": str(refresh)
        }, status=200)
        # Set cookies (optional)
        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=not settings.DEBUG,
            samesite="Lax" if settings.DEBUG else "None",
            expires=expires
        )
        response.set_cookie(
            key="refresh_token",
            value=str(refresh),
            httponly=True,
            secure=not settings.DEBUG,
            samesite="Lax" if settings.DEBUG else "None",
            expires=expires
        )
        return response


#  To fetch all data
class AdminAllDataAPIView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        data = cache.get("admin_all_data")

        if not data:
            data = {
                "categories": CategorySerializer(Category.objects.all(), many=True).data,
                "topics": TopicSerializer(Topic.objects.all(), many=True).data,
                "languages": LanguageSerializer(Language.objects.all(), many=True).data,
                "templates": TemplateSerializer(Template.objects.all(), many=True).data,
                "template_types": TemplateTypeSerializer(TemplateType.objects.all(), many=True).data,
                "frontend_codes": FrontendSourceCodeSerializer(FrontendSourceCode.objects.all(), many=True).data,
                "backend_steps": BackendStepSerializer(BackendStep.objects.all(), many=True).data,
                "backend_images": BackendImageSerializer(BackendImage.objects.all(), many=True).data,
            }

            # Cache for 10 minutes
            cache.set("admin_all_data", data, timeout=600)

        return Response(data)



# --------User / Client Login -----------
from allauth.socialaccount.models import SocialAccount
from allauth.socialaccount.providers.github.views import GitHubOAuth2Adapter
from dj_rest_auth.registration.views import SocialLoginView
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import redirect

class CustomGithubLogin(SocialLoginView):
    adapter_class = GitHubOAuth2Adapter

    def get(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        # User is now logged in
        user = request.user

        # create token
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        # send token to frontend
        frontend_url = "http://localhost:5173/User/Login"
        return redirect(f"{frontend_url}?token={access_token}")
