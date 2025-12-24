from rest_framework import serializers

from django.contrib.auth.models import User
from django.db.utils import IntegrityError
from api.models import UserProfile

class ClientRegisterSerializer(serializers.ModelSerializer):
    phone_number = serializers.CharField(required=True)
    privacy_accepted = serializers.BooleanField(required=True)
    qr_code = serializers.CharField(required=False, allow_blank=True, write_only=True)
    vin_code = serializers.CharField(required=False, allow_blank=True, write_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'password', 'phone_number', 'privacy_accepted', 'qr_code', 'vin_code']
        extra_kwargs = {
            'password': {'write_only': True, 'required': True},
        }
    
    def validate_phone_number(self, value):
        if not value:
            raise serializers.ValidationError("Номер телефона обязателен")
        if len(value) > 18:
            raise serializers.ValidationError("Номер телефона не может быть таким длинным")
        if UserProfile.objects.filter(phone_number=value).exists():
            raise serializers.ValidationError("Пользователь с таким номером телефона уже существует")
        return value
    
    def validate_privacy_accepted(self, value):
        if not value:
            raise serializers.ValidationError("Необходимо принять условия политики конфиденциальности")
        return value
    
    def create(self, validated_data):
        
        privacy_accepted = validated_data.pop('privacy_accepted')
        phone_number = validated_data.pop('phone_number')
        password = validated_data.pop('password')
        
        try:
            user = User.objects.create_user(
                username=phone_number,  # используем номер телефона как username
                password=password,
            )
            UserProfile.objects.create(
                user=user,
                phone_number=phone_number,
                privacy_accepted=privacy_accepted,
                account_type='light'  # базовый тип, обновится при активации QR кода
            )
            
            return user
        
        except IntegrityError as e:
            raise serializers.ValidationError({"phone_number": "Пользователь с таким номером телефона уже существует"})
        