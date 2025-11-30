# ==========================================
# BASE SETTINGS
# ==========================================
from datetime import timedelta
from pathlib import Path
from decouple import config
import cloudinary
import dj_database_url

# Base directory
BASE_DIR = Path(__file__).resolve().parent.parent

# ==========================================
# DEBUG / SECURITY
# ==========================================
SECRET_KEY = config('SECRET_KEY')
DEBUG = config("DEBUG", cast=bool)
ALLOWED_HOSTS = config("ALLOWED_HOSTS", default="").split(",")

# ==========================================
# JWT / TOKEN SETTINGS
# ==========================================
TOKEN_MODEL = None
REST_USE_JWT = True
REST_SESSION_LOGIN = False  # Prevent session login
ACCOUNT_AUTHENTICATED_LOGIN_REDIRECTS = False
SOCIALACCOUNT_LOGIN_ON_GET = True  # Avoid confirmation screen
JWT_AUTH_COOKIE = "jwt-auth"
JWT_AUTH_REFRESH_COOKIE = "jwt-refresh"

# ==========================================
# INSTALLED APPS
# ==========================================
INSTALLED_APPS = [
    # Django default apps
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',

    # Tokens (required)
    'rest_framework.authtoken',

    # Custom apps
    'Home',
    'Tutorial.apps.TutorialConfig',

    # Third-party apps
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'cloudinary_storage',
    'cloudinary',

    # Authentication apps
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'dj_rest_auth',
    'dj_rest_auth.registration',

    # Social providers
    # 'allauth.socialaccount.providers.google',
    # 'allauth.socialaccount.providers.facebook',
    'allauth.socialaccount.providers.github',
]

# ==========================================
# AUTHENTICATION BACKENDS
# ==========================================
AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
]

# ==========================================
# SITE SETTINGS
# ==========================================
SITE_ID = 2

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

# Redirect URLs
if DEBUG:
    LOGIN_REDIRECT_URL = "http://localhost:5173/User/Profile/"
else:
    LOGIN_REDIRECT_URL = "https://codevora140.vercel.app/User/Profile/"

LOGOUT_REDIRECT_URL = "/"

# ==========================================
# REST FRAMEWORK
# ==========================================
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
}

# ==========================================
# SIMPLE JWT
# ==========================================
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(days=7),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=14),
    "AUTH_HEADER_TYPES": ("Bearer",),
}

# ==========================================
# CACHES (Redis)
# ==========================================
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": config("REDIS_URL", default="redis://127.0.0.1:6379/1"),
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        },
    }
}

# ==========================================
# MIDDLEWARE
# ==========================================
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",  # For CORS
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",  # For static files
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "allauth.account.middleware.AccountMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# ==========================================
# URL & TEMPLATES
# ==========================================
ROOT_URLCONF = 'Backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'Backend.wsgi.application'

# ==========================================
# DATABASE
# ==========================================
if DEBUG:
    DATABASES = {
        'default': dj_database_url.parse(config('DATABASE_DEBUG_URL'))
    }
else:
    DATABASES = {
        'default': dj_database_url.parse(config('DATABASE_URL'))
    }

# ==========================================
# PASSWORD VALIDATION
# ==========================================
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ==========================================
# INTERNATIONALIZATION
# ==========================================
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# ==========================================
# STATIC FILES
# ==========================================
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [BASE_DIR / "static"]
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# ==========================================
# MEDIA FILES
# ==========================================
if DEBUG:
    MEDIA_URL = '/media/'
    MEDIA_ROOT = BASE_DIR / 'media'
else:
    MEDIA_URL = f"https://res.cloudinary.com/{config('CLOUD_NAME')}/"
    DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'
    CLOUDINARY_STORAGE = {
        'CLOUD_NAME': config('CLOUD_NAME'),
        'API_KEY': config('CLOUD_API_KEY'),
        'API_SECRET': config('CLOUD_API_SECRET'),
    }
    cloudinary.config(
        cloud_name=config('CLOUD_NAME'),
        api_key=config('CLOUD_API_KEY'),
        api_secret=config('CLOUD_API_SECRET'),
        secure=True
    )

# ==========================================
# CSRF / CORS
# ==========================================
CSRF_TRUSTED_ORIGINS = [
    "https://codevora140.vercel.app",
    "http://localhost:5173",
]

CORS_ALLOWED_ORIGINS = [
    "https://codevora140.vercel.app",
    "http://localhost:5173",
]

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_ALL_ORIGINS = True

# ==========================================
# DEFAULT AUTO FIELD
# ==========================================
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
