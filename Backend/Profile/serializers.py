from rest_framework import serializers
from Profile.models import FavoriteCode, Purchase, TransactionHistory, Playlist, PlaylistItem
from Tutorial.models import FrontendSourceCode


# ---------------- FAVORITE CODE ----------------
class FavoriteCodeSerializer(serializers.ModelSerializer):
    code_detail = serializers.SerializerMethodField()
    class Meta:
        model = FavoriteCode
        fields = ["id", "code", "code_detail", "added_at"]
    def get_code_detail(self, obj):
        return {
            "id": obj.code.id,
            "title": obj.code.title,
            "price": obj.code.price,
        }


# ---------------- PURCHASES ----------------
class PurchaseSerializer(serializers.ModelSerializer):
    code_detail = serializers.SerializerMethodField()
    class Meta:
        model = Purchase
        fields = ["id", "code", "code_detail", "amount", "payment_method", "created_at"]
    def get_code_detail(self, obj):
        if obj.code:
            return {
                "id": obj.code.id,
                "title": obj.code.title,
            }
        return None


# ---------------- TRANSACTION HISTORY ----------------
class TransactionHistorySerializer(serializers.ModelSerializer):
    purchase_detail = PurchaseSerializer(source="purchase", read_only=True)
    class Meta:
        model = TransactionHistory
        fields = ["id", "status", "detail", "created_at", "purchase_detail"]


# ---------------- PLAYLIST ----------------
class PlaylistItemSerializer(serializers.ModelSerializer):
    code_detail = serializers.SerializerMethodField()
    class Meta:
        model = PlaylistItem
        fields = ["id", "code", "code_detail", "added_at"]
    def get_code_detail(self, obj):
        return {
            "id": obj.code.id,
            "title": obj.code.title,
            "price": obj.code.price,
        }


class PlaylistSerializer(serializers.ModelSerializer):
    items = PlaylistItemSerializer(many=True, read_only=True)
    class Meta:
        model = Playlist
        fields = ["id", "name", "created_at", "items"]
