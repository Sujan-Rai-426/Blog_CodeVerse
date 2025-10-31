from rest_framework import serializers
from .models import (
    Category, Section, Language, Topic,
    FrontendVideo, FrontendVideoInfo, FrontendSourceCode,
    BackendImage, BackendStep
)

# -------------------- FRONTEND SERIALIZERS --------------------

class FrontendSourceCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = FrontendSourceCode
        fields = ['id', 'video', 'html_code', 'css_code', 'js_code']


class FrontendVideoInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = FrontendVideoInfo
        fields = ['id', 'video', 'description']


class FrontendVideoSerializer(serializers.ModelSerializer):
    video_url = serializers.SerializerMethodField()
    info = FrontendVideoInfoSerializer(read_only=True)
    source_codes = FrontendSourceCodeSerializer(many=True, read_only=True)
    class Meta:
        model = FrontendVideo
        fields = ['id', 'topic', 'title', 'video_url', 'info', 'source_codes']

    def get_video_url(self, obj):
        if obj.video_url:
            video_path = str(obj.video_url)
            if video_path.startswith("http"):
                return video_path
            return f"https://res.cloudinary.com/dusqlukhy/{video_path}"
        return None


# -------------------- BACKEND SERIALIZERS --------------------

class BackendImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = BackendImage
        fields = ['id', 'image', 'topic',]


class BackendStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = BackendStep
        fields = ['id', 'topic', 'step_number', 'step_file_name', 'step_description', 'step_source_code']
        
    def validate(self, data): # Prevent duplicate step_number for the same topic
        topic = data.get("topic")
        step_number = data.get("step_number")
        if BackendStep.objects.filter(topic=topic, step_number=step_number).exists():
            raise serializers.ValidationError(
                {"step_number": f"Step number {step_number} already exists for this topic."}
            )
        return data


# -------------------- COMMON TOPIC SERIALIZER --------------------

class TopicSerializer(serializers.ModelSerializer):
    videos = FrontendVideoSerializer(many=True, read_only=True)
    images = BackendImageSerializer(many=True, read_only=True)
    steps = BackendStepSerializer(many=True, read_only=True)

    # Add foreign key fields
    language = serializers.PrimaryKeyRelatedField(queryset=Language.objects.all())
    section = serializers.PrimaryKeyRelatedField(queryset=Section.objects.all(), required=False)
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), required=False)

    class Meta:
        model = Topic
        fields = ['id', 'name', 'language', 'section', 'category', 'videos', 'images', 'steps']



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
        
        


