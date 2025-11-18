from django.contrib import admin
from .models import (
    Category, Section, Language, Topic,
    FrontendVideo, FrontendVideoInfo, FrontendSourceCode,
    BackendImage, BackendStep, Contact,
)

# ================== CONTACT ==================
admin.site.register(Contact)

# ================== FRONTEND VIDEO INLINES ==================
class FrontendVideoInfoInline(admin.StackedInline):
    model = FrontendVideoInfo
    extra = 0
    can_delete = True
    classes = ['collapse']

class FrontendSourceCodeInline(admin.StackedInline):
    model = FrontendSourceCode
    extra = 0
    can_delete = True
    classes = ['collapse']

class FrontendVideoInline(admin.TabularInline):
    model = FrontendVideo
    extra = 0
    show_change_link = True

# ================== BACKEND INLINES ==================
class BackendStepInline(admin.StackedInline):
    model = BackendStep
    extra = 1
    show_change_link = True
    can_delete = True
    classes = ['collapse']

class BackendImageInline(admin.TabularInline):
    model = BackendImage
    extra = 1
    can_delete = True
    classes = ['collapse']

# ================== TOPIC ADMIN ==================
class TopicInline(admin.TabularInline):
    model = Topic
    extra = 1
    show_change_link = True
    classes = ['collapse']

@admin.register(Topic)
class TopicAdmin(admin.ModelAdmin):
    list_display = ("name", "language", "section_type")
    list_filter = ("language__section__name",)
    search_fields = ("name", "language__name")

    def get_inlines(self, request, obj):
        if obj:
            if obj.language.section.name == "Frontend":
                return [FrontendVideoInline]
            elif obj.language.section.name == "Backend":
                return [BackendStepInline, BackendImageInline]
        return []

    def section_type(self, obj):
        return obj.language.section.name
    section_type.short_description = "Section"

# ================== LANGUAGE ADMIN ==================
class LanguageInline(admin.TabularInline):
    model = Language
    extra = 1
    show_change_link = True
    classes = ['collapse']

@admin.register(Language)
class LanguageAdmin(admin.ModelAdmin):
    list_display = ("name", "section")
    search_fields = ("name",)
    inlines = [TopicInline]

# ================== SECTION ADMIN ==================
class SectionInline(admin.TabularInline):
    model = Section
    extra = 1
    show_change_link = True
    classes = ['collapse']

@admin.register(Section)
class SectionAdmin(admin.ModelAdmin):
    list_display = ("name", "category")
    list_filter = ("name",)
    inlines = [LanguageInline]

# ================== CATEGORY ADMIN ==================
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)
    inlines = [SectionInline]

# ================== FRONTEND VIDEO ADMIN ==================
@admin.register(FrontendVideo)
class FrontendVideoAdmin(admin.ModelAdmin):
    list_display = ('title', 'topic', 'access_type')
    inlines = [FrontendVideoInfoInline, FrontendSourceCodeInline]
    search_fields = ('title', 'topic__name')
    list_filter = ('access_type', 'topic__language__section__name')

# ================== BACKEND STEP & IMAGE ADMIN ==================
@admin.register(BackendStep)
class BackendStepAdmin(admin.ModelAdmin):
    list_display = ("topic", "step_number", "step_file_name")
    list_filter = ("topic__language__section__name",)
    search_fields = ("topic__name", "step_file_name")

@admin.register(BackendImage)
class BackendImageAdmin(admin.ModelAdmin):
    list_display = ("topic", "image")
    list_filter = ("topic__language__section__name")

# ================== ADMIN SITE CUSTOMIZATION ==================
admin.site.site_header = "CodeVerse Tutorial Admin"
admin.site.site_title = "CodeVerse Admin Portal"
admin.site.index_title = "Manage Frontend & Backend Tutorials"
