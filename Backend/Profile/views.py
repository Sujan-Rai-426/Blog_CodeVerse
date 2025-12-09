from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view

from Tutorial.models import FrontendSourceCode

from Profile.models import FavoriteCode, Purchase, TransactionHistory, Playlist, PlaylistItem
from Profile.serializers import (
    FavoriteCodeSerializer, PurchaseSerializer, TransactionHistorySerializer,
    PlaylistSerializer, PlaylistItemSerializer
)


# -------------- FAVOURITE COUNT ----------------
@api_view(['GET'])
def favourite_count(request, code_id):
    try:
        code_obj = FrontendSourceCode.objects.get(id=code_id)
    except FrontendSourceCode.DoesNotExist:
        return Response({"error": "Code not found"}, status=404)
    count = FavoriteCode.objects.filter(code_id=code_id).count()
    return Response({
        "code_id": code_id,
        "title": code_obj.title,
        "favorite_count": count
    })


# -------------- FAVORITES -------------------
class FavoriteCodeViewSet(viewsets.ModelViewSet):
    serializer_class = FavoriteCodeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return FavoriteCode.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        user = request.user
        code_id = request.data.get("code")
        if not code_id:
            return Response({"detail": "code ID required"}, status=status.HTTP_400_BAD_REQUEST)

        favorite = FavoriteCode.objects.filter(user=user, code_id=code_id).first()
        if favorite:
            favorite.delete()
            return Response({"detail": "Removed from favorites"}, status=status.HTTP_200_OK)

        serializer = self.get_serializer(data={"code": code_id})
        serializer.is_valid(raise_exception=True)
        serializer.save(user=user)
        return Response({"detail": "Added to favorites"}, status=status.HTTP_201_CREATED)



# -------------- PURCHASES -------------------
class PurchaseViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PurchaseSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return Purchase.objects.filter(user=self.request.user)


# ------------ TRANSACTION HISTORY -----------
class TransactionHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = TransactionHistorySerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return TransactionHistory.objects.filter(user=self.request.user)


# ---------------- PLAYLIST -------------------
class PlaylistViewSet(viewsets.ModelViewSet):
    serializer_class = PlaylistSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return Playlist.objects.filter(user=self.request.user)
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# ------------ PLAYLIST ITEMS -----------------
class PlaylistItemViewSet(viewsets.ModelViewSet):
    serializer_class = PlaylistItemSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return PlaylistItem.objects.filter(playlist__user=self.request.user)
    def perform_create(self, serializer):
        playlist = serializer.validated_data["playlist"]
        if playlist.user != self.request.user:
            raise PermissionError("You cannot add items to someone else’s playlist")
        serializer.save()
