# Tutorial/views.py
from django.db import IntegrityError
from django.db.models import Count
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from django.core.mail import EmailMessage, BadHeaderError
from django.views.decorators.csrf import ensure_csrf_cookie
import re

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
from Tutorial.permissions import IsAdminOrReadOnly
from Tutorial.utils import verify_email_exists


# ---------------------------- CATEGORY ----------------------------
class CategoryViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    @action(detail=True, methods=['get'], url_path='sections')
    def get_sections(self, request, pk=None):
        """Lazy-load sections for a category."""
        category = self.get_object()
        sections = category.sections.all()
        serializer = SectionSerializer(sections, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# ---------------------------- SECTION ----------------------------
class SectionViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    queryset = Section.objects.all()
    serializer_class = SectionSerializer
    @action(detail=True, methods=['get'], url_path='languages')
    def get_languages(self, request, pk=None):
        """Lazy-load languages for a section."""
        section = self.get_object()
        languages = section.languages.all()
        serializer = LanguageSerializer(languages, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# ---------------------------- LANGUAGE ----------------------------
class LanguageViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    queryset = Language.objects.all()
    serializer_class = LanguageSerializer
    @action(detail=True, methods=["get"])
    def topics(self, request, pk=None):
        language = self.get_object()
        topics = language.topics.annotate(
            source_codes_count=Count("source_codes", distinct=True),
            steps_count=Count("steps", distinct=True),
            images_count=Count("images", distinct=True),
        )
        serializer = TopicSerializer(topics, many=True)
        return Response(serializer.data)



# ---------------------------- TOPIC ----------------------------
class TopicViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    serializer_class = TopicSerializer
    def get_queryset(self):
        queryset = Topic.objects.annotate(
            source_codes_count=Count("source_codes", distinct=True),
            steps_count=Count("steps", distinct=True),
            images_count=Count("images", distinct=True),
        )
        if language_id:= self.request.query_params.get("language_id"):
            queryset = queryset.filter(language_id=language_id)
        return queryset




# ---------------------------- FRONTEND SOURCE CODES ----------------------------
class FrontendSourceCodeViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    serializer_class = FrontendSourceCodeSerializer
    def get_queryset(self):
        queryset = FrontendSourceCode.objects.all()
        if topic_id:= self.request.query_params.get("topic_id"):
            queryset = queryset.filter(topic_id=topic_id)
        return queryset
    def get_serializer_context(self):
        return {"request": self.request}



# ---------------------------- BACKEND ----------------------------
class BackendStepViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    serializer_class = BackendStepSerializer
    def get_queryset(self):
        queryset = BackendStep.objects.all()
        if topic_id := self.request.query_params.get("topic_id"):
            queryset = queryset.filter(topic_id=topic_id)
        return queryset
    @action(
        detail=False,
        methods=["get"],
        url_path="occupied-steps/(?P<topic_id>[^/.]+)"
    )
    def occupied_steps(self, request, topic_id=None):
        steps = BackendStep.objects.filter(topic_id=topic_id)
        occupied = list(steps.values_list("step_number", flat=True))
        return Response(
            {"occupied_steps": occupied},
            status=status.HTTP_200_OK
        )





class BackendImageViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    serializer_class = BackendImageSerializer
    def get_queryset(self):
        queryset = BackendImage.objects.all()
        if topic_id:= self.request.query_params.get("topic_id"):
            queryset = queryset.filter(topic_id=topic_id)
        return queryset



# ---------------------------- TEMPLATE ----------------------------
class TemplateTypeViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    serializer_class = TemplateTypeSerializer
    queryset = TemplateType.objects.all()


class TemplateViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    serializer_class = TemplateSerializer
    queryset = Template.objects.all().order_by("-created_at")


# ---------------------------- CONTACT FORM ----------------------------
EMAIL_REGEX = r"[^@]+@[^@]+\.[^@]+"

@api_view(['POST'])
def contact_form_view(request):
    name = request.data.get('name')
    email = request.data.get('email')
    subject = request.data.get('subject')
    message = request.data.get('message')
    if not all([name, email, subject, message]):
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


# ---------------------------- CSRF & DEBUG ----------------------------
@ensure_csrf_cookie
def get_csrf(request):
    return Response({"detail": "CSRF cookie set"})


def debug_test(request):
    return Response({"status": "ok", "message": "API working"}, status=200)
