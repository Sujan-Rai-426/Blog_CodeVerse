from django.db import IntegrityError
import cloudinary.uploader
from rest_framework.decorators import action

from rest_framework import viewsets
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

from .models import (
    Category, Topic, Language,
    FrontendVideo, FrontendSourceCode, FrontendVideoInfo,
    BackendStep, BackendImage
)
from .serializers import (
    CategorySerializer, TopicSerializer, LanguageSerializer,
    FrontendVideoSerializer, FrontendSourceCodeSerializer, FrontendVideoInfoSerializer,
    BackendStepSerializer, BackendImageSerializer
)

# ------------------ CATEGORY & TOPIC ------------------
class CategoryViewSet(viewsets.ModelViewSet):  # now allows POST, PUT, DELETE
    queryset = Category.objects.all().prefetch_related("sections__languages__topics__videos")
    serializer_class = CategorySerializer


class TopicViewSet(viewsets.ModelViewSet):
    queryset = Topic.objects.all().prefetch_related("videos", "steps")
    serializer_class = TopicSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            self.perform_create(serializer)
        except IntegrityError as e:
            return Response(
                {"error": "A topic with this name already exists for the selected language."},
                status=status.HTTP_400_BAD_REQUEST
            )
        return Response(serializer.data, status=201)



# ------------------ LANGUAGE ------------------
class LanguageViewSet(viewsets.ModelViewSet):
    queryset = Language.objects.all()
    serializer_class = LanguageSerializer

# ------------------ FRONTEND ------------------
class FrontendVideoViewSet(viewsets.ModelViewSet):
    queryset = FrontendVideo.objects.all()
    serializer_class = FrontendVideoSerializer
    
    def perform_create(self, serializer):
        if video_file := self.request.FILES.get('video_url'):
            upload_result = cloudinary.uploader.upload(
                video_file,
                resource_type='video',
                folder='Blog_CodeVerse/Frontend_videos/'
            )
            serializer.save(video_url=upload_result['secure_url'])
        else:
            serializer.save()



class FrontendSourceCodeViewSet(viewsets.ModelViewSet):
    queryset = FrontendSourceCode.objects.all()
    serializer_class = FrontendSourceCodeSerializer

class FrontendVideoInfoViewSet(viewsets.ModelViewSet):
    queryset = FrontendVideoInfo.objects.all()
    serializer_class = FrontendVideoInfoSerializer

# ------------------ BACKEND ------------------
class BackendStepViewSet(viewsets.ModelViewSet):
    queryset = BackendStep.objects.all()
    serializer_class = BackendStepSerializer
    
    @action(detail=False, methods=["get"], url_path="occupied-steps/(?P<topic_id>[^/.]+)")
    def occupied_steps(self, request, topic_id=None):
        steps = BackendStep.objects.filter(topic_id=topic_id).values_list("step_number", flat=True)
        return Response({"occupied_steps": list(steps)}, status=status.HTTP_200_OK)


class BackendImageViewSet(viewsets.ModelViewSet):
    queryset = BackendImage.objects.all()
    serializer_class = BackendImageSerializer
    


# View for logging in as admin
class AdminLoginAPIView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)
        if user is not None and user.is_superuser:
            # Create the JWT token with the user as the subject
            refresh = RefreshToken.for_user(user)
            
            # Add a custom claim indicating if the user is an admin
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)
            
            # Attach the 'is_admin' claim manually
            refresh.access_token["is_admin"] = True  # Custom claim indicating admin status
            
            # Return the tokens
            return Response({
                "access_token": access_token,
                "refresh_token": refresh_token,
            }, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "Invalid credentials or user is not admin."}, status=status.HTTP_401_UNAUTHORIZED)


