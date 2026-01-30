import logging
from django.conf import settings
from django.utils import timezone
from rest_framework import status
from rest_framework.viewsets import ViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response

from api.utils.decorators import handle_exceptions
from api.utils.smsVerification import send_verification_code
from api.utils.redisClient import redis_client

from sitemanagement.models import QRCode

from django.utils import timezone

logger = logging.getLogger(__name__)

class CheckCodeView(ViewSet):
    """Проверяем код с QR пользователя"""
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'])
    @handle_exceptions
    def validate_code(self, request):
        """Проверка кода из запроса пользователя и отправка SMS кода подтверждения"""
        code = request.data.get("code")
        phone_number = request.user.userprofile.phone_number

        if not code:
            return Response(
                {"error": "Не указан код"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ищем QR код: должен быть продан, но еще не активирован
        qr_code = QRCode.objects.filter(
            code=code, 
            is_selled=True,  # только проданные коды
            status='active'  # не деактивированные по таймеру
        ).first()

        if not qr_code:
            return Response(
                {
                    "action": "unavailable",
                    "message": "Такого кода не существует или он еще не продан",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        # проверяем не принадлежит ли код другому пользователю
        if qr_code.user and qr_code.user != request.user:
            return Response(
                {
                    "action": "unavailable",
                    "message": "Этот QR уже принадлежит другому пользователю",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        # проверяем принадлежит ли код текущему пользователю и активирован ли он уже
        if qr_code.user == request.user and qr_code.is_active:
            # проверяем, привязан ли QR к машине через обратное отношение
            has_car = getattr(qr_code, 'car_instance', None) is not None
            
            # получаем компанию-партнера через менеджера, который продал QR код
            partner_name = None
            if qr_code.selled_by:
                userprofile = getattr(qr_code.selled_by, 'userprofile', None)
                if userprofile:
                    partner = getattr(userprofile, 'partner', None)
                    if partner:
                        partner_name = partner.partner_name
            
            imageURL = f"{settings.BASE_URL}{qr_code.image.url}" if qr_code.image else None
            return Response(
                {
                    "action": "pass",
                    "message": "QR код уже верифицирован",
                    "code": qr_code.code,
                    "imageURL": imageURL,
                    "isAlreadyVerificated": True,
                    "hasLinkedCar": has_car,
                    "lising_company": partner_name
                },
                status=status.HTTP_200_OK,
            )

        # проверяем можно ли отправить новый код
        can_send, error_message = redis_client.can_send_new_code(phone_number)
        if not can_send:
            return Response(
                {"error": error_message},
                status=status.HTTP_400_BAD_REQUEST
            )

        # генерируем и отправляем код
        verification_code, error = send_verification_code(phone_number)
        if error:
            return Response(
                {"error": f"Ошибка отправки кода: {error}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # сохраняем код в Redis
        if not redis_client.set_verification_code(phone_number, verification_code):
            return Response(
                {"error": "Ошибка сохранения кода верификации"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # возвращаем успешный ответ с данными QR кода
        imageURL = f"{settings.BASE_URL}{qr_code.image.url}" if qr_code.image else None
        return Response(
            {
                "action": "pass",
                "message": "Код подтверждения отправлен на ваш номер телефона",
                "code": qr_code.code,
                "imageURL": imageURL,
                "isAlreadyVerificated": False
            },
            status=status.HTTP_200_OK,
        )
        
    @action(detail=False, methods=['post'])
    @handle_exceptions
    def verify_sms_code(self, request):
        """Проверка SMS кода и активация QR кода"""
        sms_code = request.data.get("sms_code")
        qr_code = request.data.get("qr_code")

        if not sms_code or not qr_code:
            return Response(
                {"error": "Необходимо указать SMS код и QR код"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # проверяем QR код: должен быть продан, но еще не активирован
        qr_code_obj = QRCode.objects.filter(
            code=qr_code, 
            is_selled=True,  # должен быть продан
            is_active=False,  # еще не активирован
            status='active'  # не деактивирован по таймеру
        ).first()

        if not qr_code_obj:
            return Response(
                {"error": "QR код не найден, уже активирован или не продан"},
                status=status.HTTP_404_NOT_FOUND,
            )

        # проверяем, не принадлежит ли код другому пользователю
        if qr_code_obj.user and qr_code_obj.user != request.user:
            return Response(
                {"error": "Этот QR код принадлежит другому пользователю"},
                status=status.HTTP_403_FORBIDDEN,
            )

        # проверяем SMS код из Redis
        phone_number = request.user.userprofile.phone_number
        is_valid = redis_client.verify_code(phone_number, sms_code)
        
        if not is_valid:
            return Response(
                {"error": "Неверный или истекший код подтверждения"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # активируем QR код
        try:
            qr_code_obj.is_active = True
            qr_code_obj.user = request.user
            qr_code_obj.is_active_timestamp = timezone.now()
            qr_code_obj.save()

            return Response(
                {
                    "message": "QR код успешно активирован",
                    "code": qr_code_obj.code,
                    "imageURL": f"{settings.BASE_URL}{qr_code_obj.image.url}" if qr_code_obj.image else None
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            logger.error(f"Error activating QR code: {e}")
            return Response(
                {"error": "Ошибка при активации QR кода"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )