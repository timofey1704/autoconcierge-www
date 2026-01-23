from rest_framework import status
from rest_framework.viewsets import ViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response

from django.shortcuts import get_object_or_404
from django.core.validators import validate_email
from django.core.exceptions import ValidationError

from api.models import UserProfile
from api.auth.serializers.userResponseSerializer import UserResponseSerializer
from api.utils.decorators import handle_exceptions

from dictionaries.models import Cities

class ChangeProfileDataView(ViewSet):
    """Действия в аккаунте пользователя:
    - PATCH данных пользователя в /account/profile
    """
    
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['patch'])
    @handle_exceptions
    def change_profile_contacts_data(self, request):
        """Обновление данных на главной странице аккаунта"""
        
        user = request.user
        user_profile = get_object_or_404(UserProfile, user=user)
        
        # обновляем данные пользователя
        if 'firstName' in request.data:
            user.first_name = request.data['firstName']
        if 'lastName' in request.data:
            user.last_name = request.data['lastName']
        if 'patronymic' in request.data:
            user_profile.patronymic = request.data['patronymic']
        if 'city' in request.data:
            city_id = request.data['city']
            if city_id:
                try:
                    city = Cities.objects.get(id=city_id)
                    user_profile.city = city
                except (Cities.DoesNotExist, ValueError):
                    raise ValidationError("Город не найден")
        if 'address' in request.data:
            user_profile.address = request.data['address']
        if 'email' in request.data:
            email = request.data['email']
            if email and email.strip():
                validate_email(email)  # handle_exceptions обработает ValidationError
                user.email = email
                user.username = email
        
        # обновляем номер телефона
        if 'phone_number' in request.data:
            phone = request.data['phone_number']
            if phone and phone.strip():
                if len(phone) < 13:  # +375331234567
                    raise ValidationError("Номер телефона слишком короткий")
                
                # проверка на уникальность только для непустых значений
                if UserProfile.objects.filter(phone_number=phone).exclude(user=user).exists():
                    raise ValidationError("Этот номер телефона уже используется")
                
                user_profile.phone_number = phone
                
        if 'telegram_id' in request.data:
            telegram_id = request.data['telegram_id']
            
            # если значение пустое - просто очищаем поле
            if not telegram_id or telegram_id.strip() == '':
                user_profile.telegram_id = None
            else:
                # проверка на уникальность только для непустых значений
                if UserProfile.objects.filter(telegram_id=telegram_id).exclude(user=user).exists():
                    raise ValidationError("Этот Telegram ID уже указал кто-то другой")
                    
                user_profile.telegram_id = telegram_id
        
        # обновляем фотографию профиля
        if 'image' in request.FILES:
            user_profile.image = request.FILES['image']
            user_profile.save()

        # сохраняем изменения
        user.save()
        user_profile.save()
        
        response_data = {
            "message": "Данные успешно обновлены",
            "user": UserResponseSerializer(user).data
        }
        return Response(response_data, status=status.HTTP_200_OK)
