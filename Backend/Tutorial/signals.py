# For Cacheing <---signals.py--->
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.core.cache import cache
from .models import Category, Topic, Language, FrontendSourceCode, BackendStep, BackendImage, Template, TemplateType

# Called whenever any of these models change — clear admin_all_data
@receiver([post_save, post_delete], sender=Category)
@receiver([post_save, post_delete], sender=Topic)
@receiver([post_save, post_delete], sender=Language)
@receiver([post_save, post_delete], sender=FrontendSourceCode)
@receiver([post_save, post_delete], sender=BackendStep)
@receiver([post_save, post_delete], sender=BackendImage)
@receiver([post_save, post_delete], sender=Template)
@receiver([post_save, post_delete], sender=TemplateType)
def clear_admin_cache(sender, **kwargs):
    cache.delete("admin_all_data")



# For GITHUB Authentication Avatar
import requests
from allauth.socialaccount.models import SocialAccount
from django.core.files import File
from django.contrib.auth.models import User
from django.core.files.base import ContentFile
from cProfile import Profile
@receiver(post_save, sender=SocialAccount)
def create_profile_avatar(semder, instance, created, **kwargs):
    if created:
        user = instance.user
        profile, _ = Profile.objects.get_or_created(user=user)
        try:
            if image_url := instance.extra_data.get(
                "picture"
            ) or instance.extra_data.get("avatar_url"):
                resp = requests.get(image_url, timeout=5)
                resp.raise_for_status()
                file_name = f"{user.username}.png"
                image_file = ContentFile(resp.content)
                profile.avatar.save(file_name, File(image_file), save=True)
        except Exception as e:
            print(e)