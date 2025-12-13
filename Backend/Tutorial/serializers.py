# Tutorial/serializers.py
from rest_framework import serializers
from Tutorial.models import (
    Category, Contact, Section, Language, Topic,
    FrontendSourceCode, BackendImage, BackendStep, TemplateType, Template
)

# ----------------------------------------------------------------------------------------------
# <------------==========-----========= DATA SERIALIZERS ========------============----------- >
# --------------------------------------------------------------------------------------------------

# -------------------- FRONTEND SERIALIZERS --------------------
class FrontendSourceCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = FrontendSourceCode
        fields = [
            'id', 'topic', 'title', 'description',
            'html_code', 'css_code', 'js_code',
            'access_type', 'price', 'hasBought', 'created_at'
        ]


# -------------------- BACKEND SERIALIZERS --------------------
class BackendImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = BackendImage
        fields = ['id', 'image', 'topic',]


class BackendStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = BackendStep
        fields = ['id', 'topic', 'step_number', 'step_file_name', 'step_description', 'step_source_code']
    def validate(self, data):
        topic = data.get("topic")
        step_number = data.get("step_number")
        step_id = self.instance.id if self.instance else None  # current step being updated
        if BackendStep.objects.filter(topic=topic, step_number=step_number).exclude(id=step_id).exists():
            raise serializers.ValidationError(
                {"step_number": f"Step number {step_number} already exists for this topic."}
            )
        return data


# -------------------- COMMON TOPIC SERIALIZER --------------------
class TopicSerializer(serializers.ModelSerializer):
    source_codes = FrontendSourceCodeSerializer(many=True, read_only=True)
    images = BackendImageSerializer(many=True, read_only=True)
    steps = BackendStepSerializer(many=True, read_only=True)

    language = serializers.PrimaryKeyRelatedField(queryset=Language.objects.all())
    section = serializers.PrimaryKeyRelatedField(queryset=Section.objects.all(), required=False)
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), required=False)

    class Meta:
        model = Topic
        fields = ['id', 'name', 'language', 'section', 'category', 'source_codes', 'images', 'steps']


# -------------------- LANGUAGE, SECTION, CATEGORY --------------------
class LanguageSerializer(serializers.ModelSerializer):
    topics = TopicSerializer(many=True, read_only=True)
    class Meta:
        model = Language
        fields = ['id', 'name', 'topics', 'icon_class', 'section']


class SectionSerializer(serializers.ModelSerializer):
    languages = LanguageSerializer(many=True, read_only=True)
    class Meta:
        model = Section
        fields = ['id', 'name', 'languages']


class CategorySerializer(serializers.ModelSerializer):
    sections = SectionSerializer(many=True, read_only=True)
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'sections']


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = '__all__'


class TemplateTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TemplateType
        fields = ["id", "name"]


class TemplateSerializer(serializers.ModelSerializer):
    template_type = TemplateTypeSerializer(read_only=True)
    template_type_id = serializers.PrimaryKeyRelatedField(
        queryset=TemplateType.objects.all(), source="template_type", write_only=True
    )

    class Meta:
        model = Template
        fields = [
            "id",
            "title",
            "project_info",
            "iframe_url",
            "download_repo_url",
            "documentation",
            "access_type",
            "price",
            "template_type",
            "template_type_id",
            "created_at",
            "updated_at",
        ]



