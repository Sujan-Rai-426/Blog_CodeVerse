from django.contrib import admin

from Library.models import LibraryComponent, LibraryComponentProp, LibraryTopic


@admin.register(LibraryComponentProp)
class PropAdmin(admin.ModelAdmin):
    list_display = ('name', 'category')
    search_fields = ('name', 'category')

@admin.register(LibraryComponent)
class LibraryComponentAdmin(admin.ModelAdmin):
    # This creates a very nice UI to move props from 'Available' to 'Selected'
    filter_horizontal = ('props',) 
    list_display = ('title', 'topic_id')

admin.site.register(LibraryTopic)