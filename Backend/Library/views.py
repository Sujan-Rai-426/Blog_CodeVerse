from rest_framework import viewsets
from Library.models import LibraryTopic, LibraryComponent
from Library.serializers import LibraryTopicSerializer, LibraryComponentSerializer

class LibraryTopicViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = LibraryTopic.objects.all()
    serializer_class = LibraryTopicSerializer


class LibraryComponentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = LibraryComponent.objects.all()
    serializer_class = LibraryComponentSerializer
    
    # Optional: Allow filtering by topic (e.g., /api/components/?topic=backgrounds)
    def get_queryset(self):
        queryset = LibraryComponent.objects.all()
        if topic_id := self.request.query_params.get('topic_id.id'):
            queryset = queryset.filter(topic__id=topic_id)
        return queryset