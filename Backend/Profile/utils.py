from .models import TransactionHistory


def record_transaction(user, purchase, status, detail=""):
    TransactionHistory.objects.create(
        user=user,
        purchase=purchase,
        status=status,
        detail=detail
    )
