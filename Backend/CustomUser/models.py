# CustomUser/models.py
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.contrib.auth.models import Group, Permission
from CustomUser.managers import CustomUserManager

class User(AbstractBaseUser, PermissionsMixin):
    """Unified user model for clients and admins"""
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=50, blank=True, null=True)
    
        # ✅ Avatar seed for Selecting Avatar [Used DiceBear Avatar]
    avatar_seed = models.CharField(
        max_length=100,
        blank=True,
        default="default"
    )


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




# ========================================================================
#                    Send Email OTP Model
# ========================================================================

import hashlib
from django.utils import timezone

class EmailOTP(models.Model):
    email = models.EmailField(unique=True)
    otp_hash = models.CharField(max_length=64) # store hashed OTP
    created_at = models.DateTimeField(auto_now_add=True)
    verified = models.BooleanField(default=False)
    attempts = models.IntegerField(default=0) # count verification attempts
    OTP_EXPIRY_MINUTES = 10
    MAX_ATTEMPTS = 5
    def generate_otp(self):
        """Generate new OTP, hash it, reset attempts & verification"""
        import random
        otp = str(random.randint(100000, 999999))
        self.otp_hash = hashlib.sha256(otp.encode()).hexdigest()
        self.created_at = timezone.now()
        self.verified = False
        self.attempts = 0
        self.save()
        return otp
    def is_expired(self):
        return timezone.now() - self.created_at > timezone.timedelta(minutes=self.OTP_EXPIRY_MINUTES)
    def verify_otp(self, otp):
        """Return True if OTP valid, increment attempts if not"""
        if self.is_expired():
            return False, "OTP expired"
        if self.attempts >= self.MAX_ATTEMPTS:
            return False, "Max attempts reached"
        hashed_input = hashlib.sha256(otp.encode()).hexdigest()
        if hashed_input == self.otp_hash:
            self.verified = True
            self.save()
            return True, "OTP verified"
        else:
            self.attempts += 1
            self.save()
            return False, "Invalid OTP"
