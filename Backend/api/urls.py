from django.urls import path, include
from rest_framework.routers import DefaultRouter
from Tutorial.views import (
    CategoryViewSet, TopicViewSet, LanguageViewSet,
    FrontendVideoViewSet, FrontendSourceCodeViewSet, FrontendVideoInfoViewSet,
    BackendStepViewSet, BackendImageViewSet, AdminLoginAPIView
)

router = DefaultRouter()
router.register("categories", CategoryViewSet, basename="category")
router.register("topics", TopicViewSet, basename="topic")

router.register("languages", LanguageViewSet, basename="language")
router.register("frontendvideos", FrontendVideoViewSet, basename="frontendvideo")
router.register("frontendsourcecodes", FrontendSourceCodeViewSet, basename="frontendsourcecode")
router.register("frontendvideoinfo", FrontendVideoInfoViewSet, basename="frontendvideoinfo")
router.register("backendsteps", BackendStepViewSet, basename="backendstep")
router.register("backendimages", BackendImageViewSet, basename="backendimage")


urlpatterns = [
    path('admin-login/', AdminLoginAPIView.as_view(), name='admin-login'),
    path("", include(router.urls)),
] 
