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
