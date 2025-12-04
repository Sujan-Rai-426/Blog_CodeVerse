# ==========================================
# settings.py - CLEAN VERSION (No OAuth / Custom Auth)
# ==========================================

import os
from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv
import dj_database_url
import cloudinary
from decouple import config

# ---------------- LOAD ENV ----------------
load_dotenv()
BASE_DIR = Path(__file__).resolve().parent.parent

# ==========================================
# DEBUG / SECURITY
# ==========================================
SECRET_KEY = os.getenv("SECRET_KEY", "unsafe-secret-key")
DEBUG = os.getenv("DEBUG", "False").lower() in ("true", "1")

ALLOWED_HOSTS = config(
    "ALLOWED_HOSTS",
    default="127.0.0.1,localhost,codevora-backend.vercel.app",
    cast=lambda v: [h.strip() for h in v.split(",") if h.strip()],
)

# ==========================================
# JWT / AUTH SETTINGS
# ==========================================
REST_USE_JWT = True
REST_SESSION_LOGIN = True  # Enables Django admin session login

# Admin JWT cookies
ADMIN_JWT_AUTH_COOKIE = "jwt-admin-access"
ADMIN_JWT_AUTH_REFRESH_COOKIE = "jwt-admin-refresh"

# User JWT cookies
USER_JWT_AUTH_COOKIE = "access_user_token"
USER_JWT_AUTH_REFRESH_COOKIE = "refresh_user_token"

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
    # "django.contrib.sites",

    # Your apps
    "Home",
    "Tutorial.apps.TutorialConfig",

    # DRF
    "rest_framework",
    "rest_framework_simplejwt",
    "rest_framework.authtoken",

    # Others
    "corsheaders",
    "cloudinary",
    "cloudinary_storage",
]

# ==========================================
# MIDDLEWARE
# ==========================================
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "corsheaders.middleware.CorsMiddleware",

    # Custom middlewares Backend/Middleware/..
    "Backend.middleware.jwt_cookie.JWTFromCookieMiddleware",
    "Backend.middleware.fix_auth_header.FixAuthorizationHeaderMiddleware",

    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",

    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# ==========================================
# AUTH BACKENDS
# ==========================================
AUTHENTICATION_BACKENDS = [
    "django.contrib.auth.backends.ModelBackend",
]

# ==========================================
# REST FRAMEWORK + SIMPLE JWT
# ==========================================
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "Backend.authentication.JWTFromCookieAuthentication",
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ]
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=5),
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
# MEDIA (local + cloudinary)
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
# TEMPLATES / WSGI
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
# CORS / CSRF
# ==========================================
CSRF_TRUSTED_ORIGINS = [
    "https://codevora140.vercel.app",
    "http://localhost:5173",
    "http://127.0.0.1:8000",
    "https://codevora-backend.vercel.app",
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://codevora140.vercel.app",
]

CORS_ALLOW_CREDENTIALS = True

if DEBUG:
    SESSION_COOKIE_SECURE = False
    CSRF_COOKIE_SECURE = False
    SESSION_COOKIE_SAMESITE = "Lax"
    CSRF_COOKIE_SAMESITE = "Lax"
else:
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SESSION_COOKIE_SAMESITE = "None"
    CSRF_COOKIE_SAMESITE = "None"

# ==========================================
# STATIC FILES
# ==========================================
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_DIRS = [BASE_DIR / "static"]
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# ==========================================
# DEFAULT FIELD
# ==========================================
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
