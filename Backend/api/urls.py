# Tutorial/urls.py
from django.conf import settings
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie

from Tutorial import views as tutorial_view
from CustomUser import views as user_view

from Profile.views import (    
    FavoriteCodeViewSet,
    PlaylistItemViewSet,
    PlaylistViewSet,
    PurchaseViewSet,
    TransactionHistoryViewSet,
    favourite_count
)

from Tutorial.views import (
    CategoryViewSet, SectionViewSet, LanguageViewSet, TopicViewSet,
    FrontendSourceCodeViewSet, BackendStepViewSet, BackendImageViewSet,
    TemplateTypeViewSet, TemplateViewSet
)

occupied_steps = BackendStepViewSet.as_view({'get': 'occupied_steps'})

# ---------------------------- CSRF ----------------------------
@ensure_csrf_cookie
def get_csrf(request):
    return JsonResponse({"detail": "CSRF cookie set"})



# ---------------------------- DEBUG ----------------------------
def debug_test(request):
    return JsonResponse({"status": "ok", "message": "API working"}, status=200)


router = DefaultRouter()

# ----------------- TEMPLATE app -----------------
router.register(r'categories', CategoryViewSet, basename='categories')
router.register(r'sections', SectionViewSet, basename='sections')
router.register(r'languages', LanguageViewSet, basename='languages')
router.register(r'topics', TopicViewSet, basename='topics')
router.register(r'frontend-source-codes', FrontendSourceCodeViewSet, basename='frontend-source-codes')
router.register(r'backend-steps', BackendStepViewSet, basename='backend-steps')
router.register(r'backend-images', BackendImageViewSet, basename='backend-images')
router.register(r'template-types', TemplateTypeViewSet, basename='template-types')
router.register(r'templates', TemplateViewSet, basename='templates')

# ----------------- PROFILE app -----------------
router.register(r"profile/favorites", FavoriteCodeViewSet, basename="favorites")
router.register(r"profile/purchases", PurchaseViewSet, basename="purchases")
router.register(r"profile/transactions", TransactionHistoryViewSet, basename="transactions")
router.register(r"profile/playlists", PlaylistViewSet, basename="playlists")
router.register(r"profile/playlist-items", PlaylistItemViewSet, basename="playlist-items")



# ---------------------------- URLPATTERNS ----------------------------
urlpatterns = [
    # CSRF & Debug
    path('csrf/', get_csrf, name='get_csrf'),
    path('debug-test/', debug_test, name='debug_test'),

    # JWT Auth
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Contact Form
    path('contact/', tutorial_view.contact_form_view, name='contact_form'),
    
    # Backend Occupied Steps
    path('backend-steps/occupied-steps/<int:topic_id>/', occupied_steps, name='occupied-steps'),
    
    # Total favorite count
    path('favorite-count/<int:code_id>/', favourite_count, name='favorite-count'),
    
    # Router Endpoints
    path('', include(router.urls)),

    # ----------------- Custom User Auth  [ CustomUser app ]-----------------
    # Admin
    path('admin-login/', user_view.AdminLoginAPIView.as_view(), name='admin-login'),
    path('admin-profile/', user_view.AdminProfileView.as_view(), name='admin-profile'),
    path('admin-logout/', user_view.AdminLogoutView.as_view(), name='admin-logout'),
    path('admin/all-data/', user_view.AdminAllDataAPIView.as_view(), name='admin-all-data'),
    path('admin/refresh/', user_view.CookieTokenRefreshView.as_view(), {"is_admin": True}, name='admin-refresh'),

    # Client/User
    path('user-register/', user_view.ClientRegisterView.as_view(), name='client-register'),
    path('user-login/', user_view.ClientLoginView.as_view(), name='client-login'),
    path('user-profile/', user_view.ClientProfileView.as_view(), name='user-profile'),
    path("user/change-password/", user_view.ClientPasswordChangeView.as_view(), name="client-change-password"),
    path('user-logout/', user_view.ClientLogoutView.as_view(), name='client-logout'),
    path('user/refresh/', user_view.CookieTokenRefreshView.as_view(), name='user-refresh'),
    path("user/avatar/", user_view.ClientUpdateAvatarView.as_view(), name="update-avatar"),
    
    
    # Admin pannel for Client User management 
    # ---------------- ADMIN USER MANAGEMENT ----------------
    path('admin/users/', user_view.AdminUserListAPIView.as_view(), name='admin-users'),
    path('admin/users/create/', user_view.AdminUserCreateAPIView.as_view(), name='admin-user-create'),
    path('admin/users/<int:pk>/', user_view.AdminUserDetailAPIView.as_view(), name='admin-user-detail'),
    path('admin/users/<int:pk>/toggle-active/', user_view.AdminUserToggleActiveAPIView.as_view(), name='admin-user-toggle-active'),

    
    # email OTP verification
    path("email-otp/send/", user_view.RequestEmailOTPView.as_view(), name="send-email-otp"),
    path("email-otp/verify/", user_view.VerifyEmailOTPView.as_view(), name="verify-email-otp"),
    
    # urls.py
    path("password-reset/otp/", user_view.PasswordResetOTPView.as_view(), name="password-reset-otp"),

]
