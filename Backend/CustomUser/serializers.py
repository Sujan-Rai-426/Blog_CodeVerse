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

    class Meta:
        model = User
        fields = ["email", "username", "full_name", "phone", "address"]

# ---------------- ADMIN LOGIN ----------------
class AdminLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
