# Tutorial/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from Tutorial import views
from Tutorial.views import (
    CategoryViewSet, TemplateTypeViewSet, TemplateViewSet, TopicViewSet, LanguageViewSet,
    FrontendSourceCodeViewSet,
    BackendStepViewSet, BackendImageViewSet, AdminLoginAPIView,
)

router = DefaultRouter()
router.register("categories", CategoryViewSet, basename="category")
router.register("topics", TopicViewSet, basename="topic")
router.register("languages", LanguageViewSet, basename="language")

# FRONTEND SOURCE CODES — canonical endpoint now
router.register("frontendsourcecodes", FrontendSourceCodeViewSet, basename="frontendsourcecode")

router.register("backendsteps", BackendStepViewSet, basename="backendstep")
router.register("backendimages", BackendImageViewSet, basename="backendimage")
router.register(r"template-types", TemplateTypeViewSet, basename="template_type")
router.register(r"templates", TemplateViewSet, basename="templates")

urlpatterns = [
    path('admin-login/', AdminLoginAPIView.as_view(), name='admin-login'),
    path('contact/', views.contact_form_view, name='contact_form'),
    path("", include(router.urls)),
]
