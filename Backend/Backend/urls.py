from django.contrib import admin
from django.urls import include, path

urlpatterns = [
        path('admin/', admin.site.urls),
        path('api/', include('api.urls')),
        
        # Social login routes
        path('accounts/', include('allauth.urls')),

        # Optional JWT routes (if you want to allow token auth)
        path('dj-rest-auth/', include('dj_rest_auth.urls')),
        path('dj-rest-auth/registration/', include('dj_rest_auth.registration.urls')),

    ]