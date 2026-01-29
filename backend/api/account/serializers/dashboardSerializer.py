from rest_framework import serializers
from sitemanagement.models import QRCode

class DashboardSerializer(serializers.ModelSerializer):
    client_full_name = serializers.SerializerMethodField()
    membership_type = serializers.SerializerMethodField()
    client_phone_number = serializers.SerializerMethodField()
    last_activity = serializers.SerializerMethodField()
    company = serializers.SerializerMethodField()
    department = serializers.SerializerMethodField()
    qr_code = serializers.CharField(source='code', read_only=True)
    
    class Meta:
        model = QRCode
        fields = [
            'id',
            'qr_code',
            'client_full_name',
            'membership_type',
            'client_phone_number',
            'is_active',
            'last_activity',
            'company',
            'department',
        ]
    
    def get_client_full_name(self, obj):
        """Получаем ФИО клиента"""
        if not obj.user:
            return "Не активирован"
        
        user = obj.user
        parts = []
        if user.last_name:
            parts.append(user.last_name)
        if user.first_name:
            parts.append(user.first_name)
        
        # добавляем отчество из профиля, если есть
        if hasattr(user, 'userprofile') and user.userprofile.patronymic:
            parts.append(user.userprofile.patronymic)
        
        return ' '.join(parts) if parts else user.username
    
    def get_membership_type(self, obj):
        """Преобразуем тип аккаунта в читаемый формат"""
        account_type_map = {
            'L': 'Light',
            'M': 'Medium',
            'P': 'Premium'
        }
        return account_type_map.get(obj.account_type, obj.account_type)
    
    def get_client_phone_number(self, obj):
        """Получаем номер телефона клиента"""
        if not obj.user:
            return None
        
        if hasattr(obj.user, 'userprofile'):
            return obj.user.userprofile.phone_number
        
        return None
    
    def get_last_activity(self, obj):
        """Возвращаем последнюю активность: дату активации или дату продажи"""
        if obj.is_active_timestamp:
            return obj.is_active_timestamp
        elif obj.is_selled_timestamp:
            return obj.is_selled_timestamp
        return None
    
    def get_company(self, obj):
        """Получаем название компании партнера"""
        if obj.partner:
            return obj.partner.partner_name
        return None
    
    def get_department(self, obj):
        """Получаем отдел менеджера, который продал QR код"""
        if not obj.selled_by:
            return None
        
        if hasattr(obj.selled_by, 'userprofile'):
            return obj.selled_by.userprofile.department
        
        return None
    