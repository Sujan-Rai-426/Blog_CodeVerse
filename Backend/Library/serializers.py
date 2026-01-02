from rest_framework import serializers
from Library.models import LibraryTopic, LibraryComponent

class LibraryTopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = LibraryTopic
        fields = '__all__'


class LibraryComponentSerializer(serializers.ModelSerializer):
    # This ensures the output says "topic_id": "backgrounds" instead of a nested object
    topic_id = serializers.PrimaryKeyRelatedField(source='topic_id.id', queryset=LibraryTopic.objects.all())
    class Meta:
        model = LibraryComponent
        fields = [
            'id', 'topic_id', 'created_at', 'title', 
            'short_title_info', 'description', 'config', 'usage'
        ]