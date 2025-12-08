# Profile/admin.py
from django.contrib import admin
from .models import FavoriteCode, Purchase, TransactionHistory, Playlist, PlaylistItem

# ---------------- FavoriteCode Admin ----------------
@admin.register(FavoriteCode)
class FavoriteCodeAdmin(admin.ModelAdmin):
    list_display = ("user", "code", "added_at")
    search_fields = ("user__email", "code__title")
    list_filter = ("added_at",)
    ordering = ("-added_at",)
    autocomplete_fields = ("user", "code")


# ---------------- Purchase Admin ----------------
@admin.register(Purchase)
class PurchaseAdmin(admin.ModelAdmin):
    list_display = ("user", "code", "amount", "payment_method", "payment_status", "transaction_id", "created_at")
    search_fields = ("user__email", "code__title", "transaction_id")
    list_filter = ("payment_method", "payment_status", "created_at")
    ordering = ("-created_at",)
    autocomplete_fields = ("user", "code")


# ---------------- TransactionHistory Admin ----------------
@admin.register(TransactionHistory)
class TransactionHistoryAdmin(admin.ModelAdmin):
    list_display = ("user", "purchase", "amount", "status", "created_at")
    search_fields = ("user__email", "purchase__transaction_id")
    list_filter = ("status", "created_at")
    ordering = ("-created_at",)
    autocomplete_fields = ("user", "purchase")


# ---------------- Playlist Admin ----------------
@admin.register(Playlist)
class PlaylistAdmin(admin.ModelAdmin):
    list_display = ("name", "user", "created_at")
    search_fields = ("name", "user__email")
    list_filter = ("created_at",)
    ordering = ("-created_at",)
    autocomplete_fields = ("user",)


# ---------------- PlaylistItem Admin ----------------
@admin.register(PlaylistItem)
class PlaylistItemAdmin(admin.ModelAdmin):
    list_display = ("playlist", "code", "added_at")
    search_fields = ("playlist__name", "code__title")
    list_filter = ("added_at",)
    ordering = ("-added_at",)
    autocomplete_fields = ("playlist", "code")
