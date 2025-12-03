# Tutorial/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from Tutorial import views
from Tutorial.views import (
    AdminAllDataAPIView, CategoryViewSet, SectionViewSet, TemplateTypeViewSet, TemplateViewSet, TopicViewSet, LanguageViewSet,
    FrontendSourceCodeViewSet,
    BackendStepViewSet, BackendImageViewSet, AdminLoginAPIView, github_login_redirect,
)

router = DefaultRouter()
router.register("categories", CategoryViewSet, basename="category")
router.register(r'sections', SectionViewSet, basename='sections')
router.register("topics", TopicViewSet, basename="topic")
router.register("languages", LanguageViewSet, basename="language")

# FRONTEND SOURCE CODES — canonical endpoint now
router.register("frontendsourcecodes", FrontendSourceCodeViewSet, basename="frontendsourcecode")

router.register("backendsteps", BackendStepViewSet, basename="backendstep")
router.register("backendimages", BackendImageViewSet, basename="backendimage")
router.register(r"template-types", TemplateTypeViewSet, basename="template_type")
router.register(r"templates", TemplateViewSet, basename="templates")

urlpatterns = [
    path("accounts/github/login/callback/", github_login_redirect, name="github-login-callback"),
    
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    
    path('admin-login/', AdminLoginAPIView.as_view(), name='admin-login'),
    path("admin/all-data/", AdminAllDataAPIView.as_view(), name="admin-all-data"),
    
    path('contact/', views.contact_form_view, name='contact_form'),
    path("", include(router.urls)),
]

