import traceback
import logging
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import timedelta
from dateutil.relativedelta import relativedelta

from django.db.utils import IntegrityError
from django.db import IntegrityError, transaction
from django.utils import timezone

from api.auth.serializers.userResponseSerializer import UserResponseSerializer
from api.auth.serializers.registerSerializer import ClientRegisterSerializer

from api.utils.cookiesSetter import AuthBaseViewSet
from sitemanagement.models import QRCode, Transactions, Membership

logger = logging.getLogger(__name__)

class RegisterViewSet(AuthBaseViewSet):
    """Регистрация клиента"""
    
    @action(detail=False, methods=['post'], url_path="verify")
    def verify_and_register_client(self, request):
        """Верификация кода и регистрация клиента (SMS временно отключена)"""
        phone_number = request.data.get('phone_number')
        qr_code = request.data.get('qr_code')
        
        now = timezone.now()
        subscription_start = now + timedelta(days=1)  # активация через 24 часа
        subscription_end = subscription_start + relativedelta(months=12)  # 1 календарный год с момента активации

        if not phone_number:
            return Response(
                {"error": "Номер телефона обязателен"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # проверяем промокод если он предоставлен
        qr_code_obj = None
        if qr_code:
            try:
                qr_code_obj = QRCode.objects.get(code=qr_code, is_active=False, is_selled=True)
            except QRCode.DoesNotExist:
                return Response(
                    {"error": "Неверный или уже использованный промокод"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # продолжаем регистрацию
        serializer = ClientRegisterSerializer(data=request.data)
        
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    user = serializer.save()
                    
                    # маппинг типов аккаунтов
                    account_type_mapping = {
                        'L': 'light',
                        'M': 'medium',
                        'P': 'premium'
                    }
                    
                    # активируем промокод если он был предоставлен
                    if qr_code_obj:
                        qr_code_obj.is_active = True
                        qr_code_obj.is_active_timestamp = timezone.now()
                        qr_code_obj.user = user  # type: ignore
                        qr_code_obj.save()
                        
                        # устанавливаем тип аккаунта из QR кода (для клиента)
                        user_profile = user.userprofile  # type: ignore
                        account_type = account_type_mapping.get(qr_code_obj.account_type, 'light')
                        user_profile.client_account_type = account_type
                        user_profile.save()
                        
                        # получаем объект Membership для создания транзакции
                        membership = Membership.objects.get(plan=account_type)
                        
                        #создаем транзакцию с нулевой оплатой
                        Transactions.objects.create(
                            user=user,
                            membership=membership,
                            amount=0,
                            auto_renewal=False,
                            status='completed',
                            request_id='initial',
                            bepaid_id=None,
                            subscription_start=subscription_start,
                            subscription_end=subscription_end
                        )
                    
                    refresh = RefreshToken.for_user(user) # type: ignore
                    user_data = UserResponseSerializer(user).data
                    
                    response = Response(
                        {
                            "message": "Успешная регистрация",
                            "user": user_data
                        }, 
                        status=status.HTTP_201_CREATED
                    )
                    
                    return self._set_auth_cookies(response, refresh)
                    
            except IntegrityError as e:
                print(f"IntegrityError during user creation: {str(e)}")
                print(f"Full error: {traceback.format_exc()}")
                return Response(
                    {"error": "Пользователь с таким email уже существует"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            except Exception as e:
                logger.error(f"Unexpected error during user creation: {str(e)}")
                logger.error(f"Full traceback: {traceback.format_exc()}")
                return Response(
                    {"error": 'При создании пользователя произошла ошибка'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            print("Serializer validation failed")
            print(f"Validation errors: {serializer.errors}")
        
        return Response(
            {
                "error": "Ошибка валидации",
                "details": serializer.errors
            }, 
            status=status.HTTP_400_BAD_REQUEST
        )