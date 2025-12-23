from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
import traceback

from django.db.utils import IntegrityError
from django.db import IntegrityError, transaction
from django.utils import timezone

from api.auth.serializers.userResponseSerializer import UserResponseSerializer
from api.auth.serializers.registerSerializer import ClientRegisterSerializer

from api.utils.cookiesSetter import AuthBaseViewSet
from api.utils.smsVerification import send_verification_code
from api.utils.redisClient import redis_client
from sitemanagement.models import QRCode, Car


class RegisterViewSet(AuthBaseViewSet):
    """Регистрация клиента"""
    
    @action(detail=False, methods=['post'], url_path="send-verification")
    def send_verification_code(self, request):
        """Отправка кода верификации на номер телефона (ВРЕМЕННО ОТКЛЮЧЕНО)"""
        phone_number = request.data.get('phone_number')
        
        # !! ВРЕМЕННО ОТКЛЮЧЕНО: пока нет SMS провайдера
        # возвращаем успешный ответ без реальной отправки SMS
        return Response(
            {"message": "Код верификации отправлен (dev mode - SMS отключена)"},
            status=status.HTTP_200_OK
        )
        
        # !! ВРЕМЕННО ОТКЛЮЧЕНО:
        # # проверяем можно ли отправить новый код
        # can_send, error_message = redis_client.can_send_new_code(phone_number)
        # if not can_send:
        #     return Response(
        #         {"error": error_message},
        #         status=status.HTTP_400_BAD_REQUEST
        #     )
        # 
        # # генерируем и отправляем код
        # verification_code, error = send_verification_code(phone_number)
        # 
        # if error:
        #     return Response(
        #         {"error": f"Ошибка отправки кода: {error}"},
        #         status=status.HTTP_500_INTERNAL_SERVER_ERROR
        #     )
        #     
        # # сохраняем код в Redis
        # if not redis_client.set_verification_code(phone_number, verification_code):
        #     return Response(
        #         {"error": "Ошибка сохранения кода верификации"},
        #         status=status.HTTP_500_INTERNAL_SERVER_ERROR
        #     )
        # 
        # return Response(
        #     {"message": "Код верификации отправлен"},
        #     status=status.HTTP_200_OK
        # )

    @action(detail=False, methods=['post'], url_path="verify")
    def verify_and_register_client(self, request):
        """Верификация кода и регистрация клиента (SMS временно отключена)"""
        phone_number = request.data.get('phone_number')
        # verification_code = request.data.get('verification_code')   # !! ВРЕМЕННО ОТКЛЮЧЕНО
        qr_code = request.data.get('qr_code')
        vin_code = request.data.get('vin_code')
        
        print(f"[REGISTER] phone_number: {phone_number}")
        print(f"[REGISTER] qr_code: {qr_code}")
        print(f"[REGISTER] vin_code: {vin_code}")

        if not phone_number:
            return Response(
                {"error": "Номер телефона обязателен"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # !! ВРЕМЕННО ОТКЛЮЧЕНО: проверка кода верификации (пока нет SMS провайдера)
        # is_valid = redis_client.verify_code(phone_number, verification_code)
        # 
        # if not is_valid:
        #     print(f"Invalid verification code for phone number: {phone_number}")
        #     return Response(
        #         {"error": "Неверный или истекший код подтверждения"},
        #         status=status.HTTP_400_BAD_REQUEST
        #     )
            
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
                        
                        # устанавливаем тип аккаунта из QR кода
                        user_profile = user.userprofile  # type: ignore
                        account_type = account_type_mapping.get(qr_code_obj.account_type, 'light')
                        user_profile.account_type = account_type
                        user_profile.save()
                    
                    # создаем машину если указан VIN код        
                    if vin_code:
                        car = Car.objects.create(vin_code=vin_code)        
                        car.user = user  # type: ignore
                        car.save()
                        
                        # связываем QR код с машиной если есть
                        if qr_code_obj:
                            qr_code_obj.car = car  # type: ignore
                            qr_code_obj.save()
                    
                    refresh = RefreshToken.for_user(user) # type: ignore
                    user_data = UserResponseSerializer(user).data
                    
                    response = Response(
                        {
                            "access": str(refresh.access_token),
                            "refresh": str(refresh),
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
                print(f"Unexpected error during user creation: {str(e)}")
                print(f"Full traceback: {traceback.format_exc()}")
                return Response(
                    {"error": str(e)},
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