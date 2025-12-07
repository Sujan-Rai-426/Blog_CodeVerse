from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from rest_framework_simplejwt.tokens import RefreshToken
User = get_user_model()
from CustomUser.models import ClientProfile

# ---------------- CLIENT REGISTER ----------------
class ClientRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ["email", "username", "password"]

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data["email"],
            username=validated_data.get("username"),
            password=validated_data["password"],
            is_client=True
        )
        # Ensure profile exists
        ClientProfile.objects.get_or_create(user=user)
        return user


# ---------------- CLIENT LOGIN ----------------
class ClientLoginSerializer(serializers.Serializer):
    identifier = serializers.CharField()
    password = serializers.CharField()
    def validate(self, attrs):
        identifier = attrs.get("identifier")
        password = attrs.get("password")

            # Lookup user by email or username
        user = User.objects.filter(email=identifier).first() or User.objects.filter(username=identifier).first()
        if not user:
            raise serializers.ValidationError({"identifier": "User not found"})
                
        # Authenticate using the actual username field (usually email if custom user model)
        user_auth = authenticate(username=user.email, password=password)
        if not user_auth:
            raise serializers.ValidationError({"non_field_errors": ["Invalid credentials"]})

        if not user.is_client:
            raise serializers.ValidationError({"non_field_errors": ["Not authorized as client"]})

        refresh = RefreshToken.for_user(user)
        return {
            "user": user,
            "tokens": {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            }
        }



# ---------------- USER PROFILE ----------------
class UserProfileSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source="profile.full_name", read_only=True)
    phone = serializers.CharField(source="profile.phone", read_only=True)
    address = serializers.CharField(source="profile.address", read_only=True)
    created_at = serializers.DateTimeField(source="profile.created_at", read_only=True)

    class Meta:
        model = User
        fields = ["email", "username", "full_name", "phone", "address", "created_at"]

# ---------------- ADMIN LOGIN ----------------
class AdminLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)




# ==============================================================================
#           Like ADMIN Pannel -->  User MANAGEMENT  
# ==============================================================================
from rest_framework import serializers
from django.contrib.auth import get_user_model
from CustomUser.models import ClientProfile, AdminProfile

User = get_user_model()


# ---------------- USER LIST SERIALIZER ----------------
class AdminUserListSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    user_type = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ["id", "email", "username", "is_active", "user_type", "full_name"]
    def get_full_name(self, obj):
        if hasattr(obj, "profile"):
            return obj.profile.full_name
        if hasattr(obj, "admin_profile"):
            return obj.admin_profile.full_name
        return ""
    def get_user_type(self, obj):
        if obj.is_admin_user or obj.is_superuser:
            return "admin"
        return "client"


# ---------------- USER DETAIL SERIALIZER ----------------
class AdminUserDetailSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    phone = serializers.SerializerMethodField()
    address = serializers.SerializerMethodField()
    user_type = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = [
            "id", "email", "username",
            "is_active", "is_staff", "is_admin_user", "is_superuser",
            "full_name", "phone", "address", "user_type"
        ]
    def get_full_name(self, obj):
        return getattr(obj.profile, "full_name", None) if obj.is_client else getattr(obj.admin_profile, "full_name", None)
    def get_phone(self, obj):
        return getattr(obj.profile, "phone", None) if obj.is_client else getattr(obj.admin_profile, "phone", None)
    def get_address(self, obj):
        return getattr(obj.profile, "address", "") if obj.is_client else ""
    def get_user_type(self, obj):
        return "admin" if obj.is_admin_user or obj.is_superuser else "client"


# ---------------- USER UPDATE SERIALIZER ----------------
class AdminUserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["email", "username", "is_active"]


# ---------------- CREATE USER (optional) ----------------
class AdminUserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ["email", "username", "password", "is_admin_user", "is_client"]
    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()

        if user.is_client:
            ClientProfile.objects.get_or_create(user=user)
        if user.is_admin_user:
            AdminProfile.objects.get_or_create(user=user)

        return user
