# Tutorial/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from Tutorial import views
from Tutorial.views import (
    AdminAllDataAPIView, CategoryViewSet, ClientLoginView, ClientLogoutView, ClientRegisterView, SectionViewSet, TemplateTypeViewSet, TemplateViewSet, TopicViewSet, LanguageViewSet,
    FrontendSourceCodeViewSet,
    BackendStepViewSet, BackendImageViewSet, AdminLoginAPIView, UserProfileView, 
    # github_login_redirect,
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
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    
    
    path('contact/', views.contact_form_view, name='contact_form'),
    path("", include(router.urls)),
    
    
    # <======= Admin url =========>
    path('admin-login/', AdminLoginAPIView.as_view(), name='admin-login'),
    path("admin/all-data/", AdminAllDataAPIView.as_view(), name="admin-all-data"),
    
    
    # <====== Client / User URLs ======>
    path('user-register/', ClientRegisterView.as_view(), name='client-register'),
    path('user-login/', ClientLoginView.as_view(), name='client-login'),
    path('user-logout/', ClientLogoutView.as_view(), name='client-logout'),
    path('user-profile/<int:client_id>/', UserProfileView.as_view(), name='user-profile'),
]

