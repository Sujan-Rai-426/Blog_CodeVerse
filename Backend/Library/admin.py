from django.contrib import admin

from Library.models import LibraryComponent, LibraryTopic

# Register your models here.

admin.site.register(LibraryTopic)
admin.site.register(LibraryComponent)
