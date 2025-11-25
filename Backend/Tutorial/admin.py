# Tutorial/admin.py
from django.contrib import admin
from .models import (
    Category, Section, Language, Topic,
    FrontendSourceCode,
    BackendImage, BackendStep, Contact, TemplateType, Template
)

# contact
admin.site.register(Contact)

@admin.register(TemplateType)
class TemplateTypeAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']

@admin.register(Template)
class TemplateAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'template_type', 'access_type', 'price', 'created_at']
    list_filter = ['access_type', 'template_type']

# inlines
class FrontendSourceCodeInline(admin.StackedInline):
    model = FrontendSourceCode
    extra = 0
    can_delete = True
    classes = ['collapse']

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

class TopicInline(admin.TabularInline):
    model = Topic
    extra = 1
    show_change_link = True
    classes = ['collapse']

class LanguageInline(admin.TabularInline):
    model = Language
    extra = 0
    show_change_link = True
    classes = ['collapse']

class SectionInline(admin.TabularInline):
    model = Section
    extra = 0
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
                return [FrontendSourceCodeInline]
            elif obj.language.section.name == "Backend":
                return [BackendStepInline, BackendImageInline]
        return []

    def section_type(self, obj):
        return obj.language.section.name
    section_type.short_description = "Section"

@admin.register(Language)
class LanguageAdmin(admin.ModelAdmin):
    list_display = ("name", "section")
    search_fields = ("name",)
    inlines = [TopicInline]

@admin.register(Section)
class SectionAdmin(admin.ModelAdmin):
    list_display = ("name", "category")
    list_filter = ("name",)
    inlines = [LanguageInline]

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)
    inlines = [SectionInline]

@admin.register(FrontendSourceCode)
class FrontendSourceCodeAdmin(admin.ModelAdmin):
    list_display = ('title', 'topic', 'access_type', 'price')
    search_fields = ('title', 'topic__name')
    list_filter = ('access_type', 'topic__language__section__name')

@admin.register(BackendStep)
class BackendStepAdmin(admin.ModelAdmin):
    list_display = ("topic", "step_number", "step_file_name")
    list_filter = ("topic__language__section__name",)
    search_fields = ("topic__name", "step_file_name")

@admin.register(BackendImage)
class BackendImageAdmin(admin.ModelAdmin):
    list_display = ("topic", "image")
    list_filter = ("topic__language__section__name",)
