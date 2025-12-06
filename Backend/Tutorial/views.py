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

    @action(detail=True, methods=['get'], url_path='topics')
    def get_topics(self, request, pk=None):
        """Lazy-load topics for a language."""
        language = self.get_object()
        topics = language.topics.annotate(
            source_codes_count=Count('source_codes', distinct=True),
            images_count=Count('images', distinct=True),
            steps_count=Count('steps', distinct=True)
        )
        serializer = TopicSerializer(topics, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


# ---------------------------- TOPIC ----------------------------
class TopicViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    serializer_class = TopicSerializer
    queryset = Topic.objects.annotate(
        source_codes_count=Count('source_codes', distinct=True),
        images_count=Count('images', distinct=True),
        steps_count=Count('steps', distinct=True)
    )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        try:
            self.perform_create(serializer)
        except IntegrityError:
            return Response(
                {"error": "A topic with this name already exists for the selected language."},
                status=status.HTTP_400_BAD_REQUEST
            )
        return Response(serializer.data, status=201)

    @action(detail=True, methods=['get'], url_path='source-codes')
    def get_source_codes(self, request, pk=None):
        topic = self.get_object()
        codes = topic.source_codes.all()
        serializer = FrontendSourceCodeSerializer(codes, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'], url_path='backend-steps')
    def get_backend_steps(self, request, pk=None):
        topic = self.get_object()
        steps = topic.steps.all()
        serializer = BackendStepSerializer(steps, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'], url_path='backend-images')
    def get_backend_images(self, request, pk=None):
        topic = self.get_object()
        images = topic.images.all()
        serializer = BackendImageSerializer(images, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# ---------------------------- FRONTEND SOURCE CODES ----------------------------
class FrontendSourceCodeViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    serializer_class = FrontendSourceCodeSerializer
    queryset = FrontendSourceCode.objects.all()

    def get_serializer_context(self):
        return {'request': self.request}  # Needed for hasBought field


# ---------------------------- BACKEND ----------------------------
class BackendStepViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    serializer_class = BackendStepSerializer
    queryset = BackendStep.objects.all()

    # CODE to give Occupied step
    def occupied_steps(self, request, topic_id=None):
        steps = BackendStep.objects.filter(topic_id=topic_id).values_list("step_number", flat=True)
        return Response({"occupied_steps": list(steps)}, status=200)



class BackendImageViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    serializer_class = BackendImageSerializer
    queryset = BackendImage.objects.all()


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
