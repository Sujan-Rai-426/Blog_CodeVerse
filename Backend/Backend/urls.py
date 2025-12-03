from django.contrib import admin
from django.urls import include, path

from Tutorial.views import CurrentUserView

from Tutorial.views import ForceRedirectSocialSignup
urlpatterns = [
        path('admin/', admin.site.urls),
        path('api/', include('api.urls')),
        

        path(
            "accounts/3rdparty/signup/",
            ForceRedirectSocialSignup.as_view(),
            name="socialaccount_signup",
        ),

        
        # Social login routes
        path('accounts/', include('allauth.urls')),
        path("api/current-user/", CurrentUserView.as_view(), name="current-user"),

        # Optional JWT routes (if you want to allow token auth)
        path('dj-rest-auth/', include('dj_rest_auth.urls')),
        path('dj-rest-auth/registration/', include('dj_rest_auth.registration.urls')),
        

    ]