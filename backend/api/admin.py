from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import UserProfile
from django.contrib.auth.models import User


class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name = 'Профиль пользователя'
    verbose_name_plural = 'Профили пользователей'
    readonly_fields = ('uuid',)
    
    def get_fields(self, request, obj=None):
        """Динамически определяем поля в зависимости от типа пользователя"""
        fields = ['user_type', 'phone_number']
        
        # если объект существует, показываем нужное поле account_type
        if obj and hasattr(obj, 'userprofile'):
            profile = obj.userprofile
            if profile.user_type == 'manager':
                fields.append('manager_account_type')
            else:
                fields.append('client_account_type')
        else:
            # при создании показываем оба поля (можно выбрать любое)
            fields.extend(['client_account_type', 'manager_account_type'])
        
        fields.extend(['uuid', 'privacy_accepted', 'image'])
        return fields
    
    def get_fieldsets(self, request, obj=None):
        """Переопределяем fieldsets для группировки полей"""
        if obj and hasattr(obj, 'userprofile'):
            profile = obj.userprofile
            if profile.user_type == 'manager':
                account_field = ('manager_account_type',)
            else:
                account_field = ('client_account_type',)
            
            return (
                ('Основная информация', {
                    'fields': ('user_type', 'phone_number', 'uuid')
                }),
                ('Тип аккаунта', {
                    'fields': account_field
                }),
                ('Дополнительно', {
                    'fields': ('privacy_accepted', 'image')
                }),
            )
        else:
            # при создании
            return (
                ('Основная информация', {
                    'fields': ('user_type', 'phone_number', 'uuid')
                }),
                ('Тип аккаунта', {
                    'fields': ('client_account_type', 'manager_account_type'),
                    'description': 'Выберите тип аккаунта в зависимости от типа пользователя'
                }),
                ('Дополнительно', {
                    'fields': ('privacy_accepted', 'image')
                }),
            )

class UserAdmin(BaseUserAdmin):
    inlines = (UserProfileInline,)
    
admin.site.unregister(User)
admin.site.register(User, UserAdmin)