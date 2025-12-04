# Tutorial/views.py
from django.db import IntegrityError

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.authentication import JWTAuthentication

from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

# Tutorial/views.py
from Tutorial.permissions import IsAdminOrReadOnly
from Tutorial.utils import verify_email_exists

# For contact
import re
from django.core.cache import cache
from django.core.mail import EmailMessage, BadHeaderError


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


# ----------------------------------------------------------------------------------------------
# <------==========-----========  DATA VIEWSET ========------============----------- >
# --------------------------------------------------------------------------------------------------

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




# ----------------------------------------------------------------------------------------------
# <-------==========-----========  ADMIN VIEWSET ========------============----------- >
# --------------------------------------------------------------------------------------------------
# Tutorial/views.py
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

@method_decorator(csrf_exempt, name='dispatch')  # Disable CSRF for API
class AdminLoginAPIView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        if not username or not password:
            return Response({"detail": "Username and password required"}, status=400)
        user = authenticate(username=username, password=password)
        if user is not None and user.is_superuser:
            # Generate JWT token
            refresh = RefreshToken.for_user(user)
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "username": user.username,
            })
        else:
            return Response({"detail": "Invalid credentials or not an admin."}, status=401)


#  To fetch all data
class AdminAllDataAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAdminUser]  # Only superuser/admin

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







# ----------------------------------------------------------------------------------------------
# <--------==========-----========  CLIENTS / USER VIEWSET ========------============----------- >
# --------------------------------------------------------------------------------------------------

# ------- client login view ---------
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import ClientAuth

# --------- ClientAuth Register Viewset --------------
from rest_framework import generics
from .models import ClientAuth
from .serializers import ClientRegisterSerializer
class ClientRegisterView(generics.CreateAPIView):
    queryset = ClientAuth.objects.all()
    serializer_class = ClientRegisterSerializer
    
    
class ClientLoginView(APIView):
    def post(self, request):
        identifier = request.data.get("identifier")  # email or username
        password = request.data.get("password")
        if not identifier or not password:
            return Response({"error": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            client = ClientAuth.objects.get(email=identifier)
        except ClientAuth.DoesNotExist:
            try:
                client = ClientAuth.objects.get(username=identifier)
            except ClientAuth.DoesNotExist:
                return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        if client.check_password(password):
            return Response({"message": "Login successful", "client_id": client.id})
        else:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class ClientLogoutView(APIView):
    def post(self, request):
        # If using cookies, you can clear them here
        response = Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)
        response.delete_cookie("access_token")  # if you later use cookies
        return response


# ------- ClientAuth / User Profile View -----------
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import ClientAuth, ClientProfile

class UserProfileView(APIView):
    def get(self, request, client_id):
        try:
            client = ClientAuth.objects.get(id=client_id)
        except ClientAuth.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
        profile = client.profile
        return Response({
            "username": client.username,
            "email": client.email,
            "full_name": profile.full_name,
            "phone": profile.phone,
            "address": profile.address,
            "created_at": profile.created_at,
        })

