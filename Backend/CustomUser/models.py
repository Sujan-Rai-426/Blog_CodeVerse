# CustomUser/models.py
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.contrib.auth.models import Group, Permission
from CustomUser.managers import CustomUserManager

class User(AbstractBaseUser, PermissionsMixin):
    """Unified user model for clients and admins"""
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=50, blank=True, null=True)

    # Permissions
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)         # Admin only
    is_superuser = models.BooleanField(default=False)     # Admin only
    is_admin_user = models.BooleanField(default=False)    # Admin flag
    is_client = models.BooleanField(default=False)        # Client flag

    # Avoid reverse accessor clashes
    groups = models.ManyToManyField(Group, related_name="customuser_users", blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name="customuser_user_permissions", blank=True)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []  # username optional

    def __str__(self):
        return f"{self.username or self.email}"

# ---------------- CLIENT PROFILE ----------------
class ClientProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    full_name = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username or self.user.email



# -------------------- ADMIN models.py-------------------------

class AdminProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="admin_profile")
    full_name = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    department = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.email



