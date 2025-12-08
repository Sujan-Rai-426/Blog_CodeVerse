from django.db import models
from CustomUser.models import User


# -------------------------------------------------------
#  Favourite Codes
# -------------------------------------------------------
class FavoriteCode(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="favorites")
    code = models.ForeignKey("Tutorial.FrontendSourceCode", on_delete=models.CASCADE, related_name="favorited_by")
    added_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        unique_together = ("user", "code")
    def __str__(self):
        return f"{self.user.email} ❤️ {self.code.title}"


# -------------------------------------------------------
#  Purchases (Premium Code Buy)
# -------------------------------------------------------
class Purchase(models.Model):
    STATUS = [
        ("Pending", "Pending"),
        ("Success", "Success"),
        ("Failed", "Failed"),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="purchases")
    code = models.ForeignKey("Tutorial.FrontendSourceCode", on_delete=models.SET_NULL, null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(
        max_length=20,
        choices=[("Khalti", "Khalti"), ("BankTransfer", "BankTransfer")]
    )
    payment_status = models.CharField(max_length=20, choices=STATUS, default="Pending")
    transaction_id = models.CharField(max_length=100, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.user.email} bought {self.code} for Rs.{self.amount}"


# -------------------------------------------------------
#  Transaction History
# -------------------------------------------------------
class TransactionHistory(models.Model):
    STATUS_CHOICES = [
        ("Success", "Success"),
        ("Failed", "Failed"),
        ("Pending", "Pending"),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="transactions")
    purchase = models.ForeignKey(Purchase, on_delete=models.SET_NULL, null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    detail = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.user.email} - {self.status}"


# -------------------------------------------------------
#  Playlist (group of codes)
# -------------------------------------------------------
class Playlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="playlists")
    name = models.CharField(max_length=150)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        unique_together = ("user", "name")
    def __str__(self):
        return f"{self.user.email} Playlist: {self.name}"


# -------------------------------------------------------
#  Playlist Items
# -------------------------------------------------------
class PlaylistItem(models.Model):
    playlist = models.ForeignKey(Playlist, on_delete=models.CASCADE, related_name="items")
    code = models.ForeignKey("Tutorial.FrontendSourceCode", on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        unique_together = ("playlist", "code")
    def __str__(self):
        return f"{self.code.title} in {self.playlist.name}"
