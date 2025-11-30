from django.urls import path, include
from rest_framework.routers import DefaultRouter
from Tutorial import views
from Tutorial.views import (
    AdminAllDataAPIView, CategoryViewSet, SectionViewSet, TemplateTypeViewSet, TemplateViewSet, TopicViewSet, LanguageViewSet,
    FrontendSourceCodeViewSet, BackendStepViewSet, BackendImageViewSet, AdminLoginAPIView,
)

router = DefaultRouter()
router.register("categories", CategoryViewSet, basename="category")
router.register(r'sections', SectionViewSet, basename='sections')
router.register("topics", TopicViewSet, basename="topic")
router.register("languages", LanguageViewSet, basename="language")
router.register("frontendsourcecodes", FrontendSourceCodeViewSet, basename="frontendsourcecode")
router.register("backendsteps", BackendStepViewSet, basename="backendstep")
router.register("backendimages", BackendImageViewSet, basename="backendimage")
router.register(r"template-types", TemplateTypeViewSet, basename="template_type")
router.register(r"templates", TemplateViewSet, basename="templates")

urlpatterns = [
    path('admin-login/', AdminLoginAPIView.as_view(), name='admin-login'),
    path("admin/all-data/", AdminAllDataAPIView.as_view(), name="admin-all-data"),

    path('contact/', views.contact_form_view, name='contact_form'),
    path("", include(router.urls)),
]
