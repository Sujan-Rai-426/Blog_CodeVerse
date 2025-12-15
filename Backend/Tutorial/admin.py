# Tutorial/admin.py

from django.contrib import admin
from Tutorial.models import (
    Category, Section, Language, Topic,
    FrontendSourceCode,
    BackendImage, BackendStep, Contact, TemplateType, Template
)

# contact
admin.site.register(Contact)

@admin.register(TemplateType)
class TemplateTypeAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']
    list_display_links = ['id', 'name']  # 👈 clickable ID and name

@admin.register(Template)
class TemplateAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'template_type', 'access_type', 'price', 'created_at']
    list_filter = ['access_type', 'template_type']
    list_display_links = ['id', 'title']  # 👈 clickable ID and title


# =======================
# INLINE CONFIGURATIONS
# =======================

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
    
    

# =======================
# CUSTOM FILTER  -->  FILTER HELPERS
# =======================



class BackendTopicFilter(admin.SimpleListFilter):
    title = "Backend Topics"
    parameter_name = "topic"

    def lookups(self, request, model_admin):
        backend_topics = Topic.objects.filter(language__section__name="Backend")
        return [(t.id, t.name) for t in backend_topics]

    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(topic_id=self.value())
        return queryset


class BackendLanguageFilter(admin.SimpleListFilter):
    title = "Backend Languages"
    parameter_name = "language"

    def lookups(self, request, model_admin):
        backend_langs = Language.objects.filter(section__name="Backend")
        return [(l.id, l.name) for l in backend_langs]

    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(topic__language_id=self.value())
        return queryset


class FrontendTopicFilter(admin.SimpleListFilter):
    title = "Frontend Topics"
    parameter_name = "topic"

    def lookups(self, request, model_admin):
        frontend_topics = Topic.objects.filter(language__section__name="Frontend")
        return [(t.id, t.name) for t in frontend_topics]

    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(topic_id=self.value())
        return queryset



class FrontendLanguageFilter(admin.SimpleListFilter):
    title = "Frontend Languages"
    parameter_name = "language"

    def lookups(self, request, model_admin):
        frontend_langs = Language.objects.filter(section__name="Frontend")
        return [(l.id, l.name) for l in frontend_langs]

    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(topic__language_id=self.value())
        return queryset


# =======================
# TOPIC ADMIN
# =======================

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


# =======================
# LANGUAGE ADMIN
# =======================

@admin.register(Language)
class LanguageAdmin(admin.ModelAdmin):
    list_display = ("name", "section")
    search_fields = ("name",)
    list_filter = ("section",)
    inlines = []


# =======================
# SECTION ADMIN
# =======================

@admin.register(Section)
class SectionAdmin(admin.ModelAdmin):
    list_display = ("name", "category")
    list_filter = ("name",)
    inlines = [LanguageInline]


# =======================
# CATEGORY ADMIN
# =======================

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)
    inlines = [SectionInline]


# =======================
# FRONTEND SOURCE CODE
# (FILTER BY TOPIC)
# =======================

@admin.register(FrontendSourceCode)
class FrontendSourceCodeAdmin(admin.ModelAdmin):
    list_display = ('title', 'topic', 'access_type', 'price')
    search_fields = ('title', 'topic__name')

    # ONLY FRONTEND TOPICS & LANGUAGES
    list_filter = (
        FrontendTopicFilter,
        FrontendLanguageFilter,
        'access_type',
    )


# =======================
# BACKEND STEP
# (FILTER BY TOPIC)
# =======================

@admin.register(BackendStep)
class BackendStepAdmin(admin.ModelAdmin):
    list_display = ("topic", "step_number", "step_file_name")
    search_fields = ("topic__name", "step_file_name")

    # ONLY BACKEND TOPICS & LANGUAGES
    list_filter = (
        BackendTopicFilter,
        BackendLanguageFilter,
    )


# =======================
# BACKEND IMAGE
# (FILTER BY TOPIC)
# =======================

@admin.register(BackendImage)
class BackendImageAdmin(admin.ModelAdmin):
    list_display = ("topic", "image")
    search_fields = ("topic__name",)

    # ONLY BACKEND TOPICS & LANGUAGES
    list_filter = (
        BackendTopicFilter,
        BackendLanguageFilter,
    )
