from django.apps import AppConfig


class TutorialConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'Tutorial'
    
    def ready(self):
        # import signals to register them <-- For cacheing in server side
        import Tutorial.signals  # noqa