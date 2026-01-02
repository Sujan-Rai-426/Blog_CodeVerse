from rest_framework import serializers
from Library.models import LibraryComponentProp, LibraryTopic, LibraryComponent


class LibraryComponentPropSerializer(serializers.ModelSerializer):
    class Meta:
        model = LibraryComponentProp
        fields = ['name', 'prop_type', 'default_value', 'description', "category"]



class LibraryTopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = LibraryTopic
        fields = '__all__'


class LibraryComponentSerializer(serializers.ModelSerializer):
    # This ensures the output says "topic_id": "backgrounds" instead of a nested object
    topic_id = serializers.PrimaryKeyRelatedField(source='topic_id.id', queryset=LibraryTopic.objects.all())
    props = LibraryComponentPropSerializer(many=True, read_only=True)
    class Meta:
        model = LibraryComponent
        fields = [
            'id', 'topic_id', 'created_at', 'title', 
            'short_title_info', 'description', 'config', 'usage', 'props',
        ]