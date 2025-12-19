# Tutorial/serializers.py
from django.db.models import Count
from rest_framework import serializers

from Tutorial.models import (
    Category, Contact, Section, Language, Topic,
    FrontendSourceCode, BackendImage, BackendStep,
    TemplateType, Template
)

# ----------------------------------------------------------------------------------
# FRONTEND SOURCE CODE
# ----------------------------------------------------------------------------------

class FrontendSourceCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = FrontendSourceCode
        fields = [
            "id",
            "topic",
            "title",
            "description",
            "html_code",
            "css_code",
            "js_code",
            "access_type",
            "price",
            "hasBought",
            "created_at",
        ]


# ----------------------------------------------------------------------------------
# BACKEND SERIALIZERS
# ----------------------------------------------------------------------------------

class BackendImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = BackendImage
        fields = ["id", "image", "topic"]


class BackendStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = BackendStep
        fields = [
            "id",
            "topic",
            "step_number",
            "step_file_name",
            "step_description",
            "step_source_code",
        ]
    def validate(self, data):
        topic = data.get("topic")
        step_number = data.get("step_number")
        step_id = self.instance.id if self.instance else None

        if BackendStep.objects.filter(
            topic=topic,
            step_number=step_number
        ).exclude(id=step_id).exists():
            raise serializers.ValidationError(
                {"step_number": f"Step number {step_number} already exists for this topic."}
            )

        return data


# ----------------------------------------------------------------------------------
# TOPIC SERIALIZERS
# ----------------------------------------------------------------------------------

# 🔹 LIGHT serializer (used in Language → Topics list)
class TopicListSerializer(serializers.ModelSerializer):
    source_codes_count = serializers.IntegerField(read_only=True)
    steps_count = serializers.IntegerField(read_only=True)
    images_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Topic
        fields = [
            "id",
            "name",
            "source_codes_count",
            "steps_count",
            "images_count",
        ]


# 🔹 FULL serializer (used only for Topic detail page)
class TopicSerializer(serializers.ModelSerializer):
    source_codes = FrontendSourceCodeSerializer(many=True, read_only=True)
    images = BackendImageSerializer(many=True, read_only=True)
    steps = BackendStepSerializer(many=True, read_only=True)

    language = serializers.PrimaryKeyRelatedField(
        queryset=Language.objects.all()
    )

    class Meta:
        model = Topic
        fields = [
            "id",
            "name",
            "language",
            "source_codes",
            "images",
            "steps",
        ]


# ----------------------------------------------------------------------------------
# LANGUAGE, SECTION, CATEGORY
# ----------------------------------------------------------------------------------

class LanguageSerializer(serializers.ModelSerializer):
    topics = serializers.SerializerMethodField()

    class Meta:
        model = Language
        fields = [
            "id",
            "name",
            "icon_class",
            "section",
            "topics",
        ]

    def get_topics(self, obj):
        """
        Return ONLY topics belonging to this language
        (lightweight + counted)
        """
        topics = obj.topics.annotate(
            source_codes_count=Count("source_codes", distinct=True),
            steps_count=Count("steps", distinct=True),
            images_count=Count("images", distinct=True),
        )
        return TopicListSerializer(topics, many=True).data


class SectionSerializer(serializers.ModelSerializer):
    languages = LanguageSerializer(many=True, read_only=True)
    class Meta:
        model = Section
        fields = ["id", "name", "languages"]


class CategorySerializer(serializers.ModelSerializer):
    sections = SectionSerializer(many=True, read_only=True)
    class Meta:
        model = Category
        fields = ["id", "name", "description", "sections"]


# ----------------------------------------------------------------------------------
# CONTACT
# ----------------------------------------------------------------------------------

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = "__all__"


# ----------------------------------------------------------------------------------
# TEMPLATES
# ----------------------------------------------------------------------------------

class TemplateTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TemplateType
        fields = ["id", "name"]


class TemplateSerializer(serializers.ModelSerializer):
    template_type = TemplateTypeSerializer(read_only=True)
    template_type_id = serializers.PrimaryKeyRelatedField(
        queryset=TemplateType.objects.all(),
        source="template_type",
        write_only=True,
    )

    class Meta:
        model = Template
        fields = [
            "id",
            "title",
            "project_info",
            "iframe_url",
            "download_repo_url",
            "documentation_url",
            "github_repo_url",
            "access_type",
            "price",
            "template_type",
            "template_type_id",
            "created_at",
            "updated_at",
        ]
