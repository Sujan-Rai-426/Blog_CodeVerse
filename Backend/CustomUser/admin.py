from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, ClientProfile, AdminProfile
from django.utils.translation import gettext_lazy as _

# ----------------- INLINE MODELS -----------------
class ClientProfileInline(admin.StackedInline):
    model = ClientProfile
    can_delete = False
    verbose_name = "Client Profile"
    fk_name = 'user'

class AdminProfileInline(admin.StackedInline):
    model = AdminProfile
    can_delete = False
    verbose_name = "Admin Profile"
    fk_name = 'user'

# ----------------- CUSTOM USER ADMIN -----------------
class CustomUserAdmin(BaseUserAdmin):
    model = User
    list_display = ('email', 'username', 'is_staff', 'is_superuser', 'is_active', 'is_client', 'is_admin_user')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'is_client')
    search_fields = ('email', 'username')
    ordering = ('email',)
    fieldsets = (
        (None, {'fields': ('email', 'username', 'password')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'is_client', 'is_admin_user', 'groups', 'user_permissions')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2', 'is_active', 'is_staff', 'is_superuser', 'is_client', 'is_admin_user')}
        ),
    )
    # Show inlines based on user type
    def get_inline_instances(self, request, obj=None):
        if obj is None:
            return []
        inlines = []
        if obj.is_client:
            inlines.append(ClientProfileInline(self.model, self.admin_site))
        if obj.is_staff or obj.is_superuser:
            inlines.append(AdminProfileInline(self.model, self.admin_site))
        return inlines


# ----------------- CLIENT PROFILE ADMIN -----------------
class ClientProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'full_name', 'phone', 'created_at')
    search_fields = ('user__email', 'full_name', 'phone')

# ----------------- ADMIN PROFILE ADMIN -----------------
class AdminProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'full_name', 'phone', 'department', 'created_at')
    search_fields = ('user__email', 'full_name', 'phone', 'department')

# ----------------- REGISTER -----------------
admin.site.register(User, CustomUserAdmin)
admin.site.register(ClientProfile, ClientProfileAdmin)
admin.site.register(AdminProfile, AdminProfileAdmin)
