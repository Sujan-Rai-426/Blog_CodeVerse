from rest_framework import serializers
from Profile.models import FavoriteCode, Purchase, TransactionHistory, Playlist, PlaylistItem
from Tutorial.models import FrontendSourceCode


# ---------------- FAVORITE CODE ----------------
class FavoriteCodeSerializer(serializers.ModelSerializer):
    code_detail = serializers.SerializerMethodField()
    class Meta:
        model = FavoriteCode
        fields = ["id", "code", "code_detail", "added_at",]
    # Fetching detail inside the id of the code  [i.e of Favourite Source Code]
    def get_code_detail(self, obj):  
        return {
            "id": obj.code.id,
            "title": obj.code.title,
            "price": obj.code.price,
            "html_code": obj.code.html_code,
            "css_code": obj.code.css_code,
            "js_code": obj.code.js_code,
            "topic_id": obj.code.topic.id,#topic id where code id belong
        }
    def get_favourite_count(self, obj):
        # Count how many users have this code as favourite
        return obj.code.favorites.count()  # assuming related_name='favorites' in FavoriteCode model


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
