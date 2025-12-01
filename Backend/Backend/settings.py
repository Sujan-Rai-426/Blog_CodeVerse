# ==========================================
# settings.py - Complete Updated Version
# ==========================================

import os
from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv
from urllib.parse import urlparse, parse_qsl
import dj_database_url
import cloudinary

# ---------------- LOAD ENV ----------------
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

# ==========================================
# DEBUG / SECURITY
# ==========================================
SECRET_KEY = os.getenv("SECRET_KEY")
DEBUG = os.getenv("DEBUG", "False").lower() in ("true", "1")

ALLOWED_HOSTS = list(filter(None, os.getenv("ALLOWED_HOSTS", "").replace(" ", "").split(",")))
ALLOWED_HOSTS += [".vercel.app", ".now.sh"]

# ==========================================
# JWT / AUTH SETTINGS
# ==========================================
TOKEN_MODEL = None
REST_USE_JWT = True
REST_SESSION_LOGIN = False  # ✅ Enable session login for /admin

ACCOUNT_AUTHENTICATED_LOGIN_REDIRECTS = False
SOCIALACCOUNT_LOGIN_ON_GET = True

JWT_AUTH_COOKIE = "jwt-access"
JWT_AUTH_REFRESH_COOKIE = "jwt-refresh"

# ==========================================
# INSTALLED APPS
# ==========================================
INSTALLED_APPS = [
    # Django
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.sites",

    # Backend apps
    "Home",
    "Tutorial.apps.TutorialConfig",

    # DRF
    "rest_framework",
    "rest_framework_simplejwt",
    "rest_framework.authtoken",

    # Auth + social login
    "allauth",
    "allauth.account",
    "allauth.socialaccount",
    "dj_rest_auth",
    "dj_rest_auth.registration",

    # Providers
    "allauth.socialaccount.providers.github",

    # Others
    "corsheaders",
    "cloudinary",
    "cloudinary_storage",
]


# ==========================================
# MIDDLEWARE
# ==========================================
MIDDLEWARE = [
    "Backend.middleware.fix_auth_header.FixAuthorizationHeaderMiddleware", #manually added by creating for vercel <-- Backend/middleware/fix_auth_header.py
    "whitenoise.middleware.WhiteNoiseMiddleware",  # css whitenoise here
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "allauth.account.middleware.AccountMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

SITE_ID = 2

# ==========================================
# AUTH BACKENDS
# ==========================================
AUTHENTICATION_BACKENDS = [
    "django.contrib.auth.backends.ModelBackend",
    "allauth.account.auth_backends.AuthenticationBackend",
]

# ==========================================
# ALLAUTH SETTINGS
# ==========================================
ACCOUNT_EMAIL_VERIFICATION = "none"
ACCOUNT_EMAIL_REQUIRED = True
SOCIALACCOUNT_EMAIL_REQUIRED = True
SOCIALACCOUNT_EMAIL_VERIFICATION = "none"
SOCIALACCOUNT_AUTO_SIGNUP = True
SOCIALACCOUNT_STORE_TOKENS = False
SOCIALACCOUNT_ADAPTER = "Tutorial.adapter.MySocialAccountAdapter"

LOGIN_REDIRECT_URL = (
    "http://localhost:5173/User/Profile/" if DEBUG else "https://codevora140.vercel.app/User/Profile/"
)
LOGOUT_REDIRECT_URL = "/"

# ==========================================
# REST FRAMEWORK + SIMPLE JWT
# ==========================================
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        # "rest_framework.authentication.SessionAuthentication",  # ✅ Enable session auth
    ],
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(days=7),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=14),
    "AUTH_HEADER_TYPES": ("Bearer",),
}

# ==========================================
# DATABASE
# ==========================================
if DEBUG:
    DATABASES = {"default": dj_database_url.parse(os.getenv("DATABASE_DEBUG_URL"))}
else:
    DATABASES = {"default": dj_database_url.parse(os.getenv("DATABASE_URL"))}

# ==========================================
# PASSWORD VALIDATION
# ==========================================
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# ==========================================
# INTERNATIONALIZATION
# ==========================================
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True



# ==========================================
# MEDIA FILES (Cloudinary / Local)
# ==========================================
if DEBUG:
    MEDIA_URL = "/media/"
    MEDIA_ROOT = BASE_DIR / "media"
else:
    MEDIA_URL = f"https://res.cloudinary.com/{os.getenv('CLOUD_NAME')}/"
    DEFAULT_FILE_STORAGE = "cloudinary_storage.storage.MediaCloudinaryStorage"
    CLOUDINARY_STORAGE = {
        "CLOUD_NAME": os.getenv("CLOUD_NAME"),
        "API_KEY": os.getenv("CLOUD_API_KEY"),
        "API_SECRET": os.getenv("CLOUD_API_SECRET"),
    }
    cloudinary.config(
        cloud_name=os.getenv("CLOUD_NAME"),
        api_key=os.getenv("CLOUD_API_KEY"),
        api_secret=os.getenv("CLOUD_API_SECRET"),
        secure=True,
    )

# ==========================================
# CACHES - REDIS
# ==========================================
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": os.getenv("REDIS_URL", "redis://127.0.0.1:6379/1"),
        "OPTIONS": {"CLIENT_CLASS": "django_redis.client.DefaultClient"},
    }
}


# ==========================================
# URL / TEMPLATES / WSGI
# ==========================================
ROOT_URLCONF = "Backend.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.template.context_processors.csrf",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "Backend.wsgi.application"

# ==========================================
# CSRF / CORS
# ==========================================
CSRF_TRUSTED_ORIGINS = [
    "https://codevora140.vercel.app",
    "http://localhost:5173",
    "http://127.0.0.1:8000",
    "https://codevora-backend.vercel.app",
]

CORS_ALLOWED_ORIGINS = [
    "https://codevora140.vercel.app",
    "http://localhost:5173",
]

CORS_ALLOW_CREDENTIALS = True

# Session / CSRF Cookies
SESSION_COOKIE_SECURE = not DEBUG
SESSION_COOKIE_SAMESITE = "None"
CSRF_COOKIE_SECURE = not DEBUG
CSRF_COOKIE_SAMESITE = "None"


# ==========================================
# STATIC FILES
# ==========================================
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"  # collectstatic output
STATICFILES_DIRS = [
    BASE_DIR / "static",  # your custom static files (optional)
]

STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"



# ==========================================
# DEFAULT FIELD
# ==========================================
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
