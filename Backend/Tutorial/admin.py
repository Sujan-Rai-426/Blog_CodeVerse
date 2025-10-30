from django.contrib import admin
from Tutorial.models import Category, Section, Language, Topic, FrontendVideo, FrontendVideoInfo, FrontendSourceCode, BackendImage, BackendStep

# Register your models here.
admin.site.register(Category)
admin.site.register(Section)
admin.site.register(Language)
admin.site.register(Topic)
admin.site.register(FrontendVideo)
admin.site.register(FrontendVideoInfo)
admin.site.register(FrontendSourceCode)
admin.site.register(BackendImage)
admin.site.register(BackendStep)
# admin.site.register(BackendStepInfo)
# admin.site.register(BackendStepCode)
