# CustomUser/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from CustomUser.models import ClientProfile

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_or_save_profile(sender, instance, created, **kwargs):
    """
    Automatically create a ClientProfile for every user,
    including admins/superusers, and save it on update.
    """
    if created:
        # Create profile if it doesn't exist
        if not hasattr(instance, 'profile'):
            ClientProfile.objects.create(user=instance)
    else:
        # Save existing profile on update
        if hasattr(instance, 'profile'):
            instance.profile.save()



# ============ ADMIN =============
# signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from CustomUser.models import AdminProfile

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_admin_profile(sender, instance, created, **kwargs):
    if created and (instance.is_staff or instance.is_superuser):
        AdminProfile.objects.create(user=instance)

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def save_admin_profile(sender, instance, **kwargs):
    if hasattr(instance, "admin_profile"):
        instance.admin_profile.save()

