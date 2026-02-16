from django.conf import settings
from django.utils import timezone
from datetime import timedelta
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from api.utils.exceptionsHandler import handle_exceptions

from sitemanagement.models import QRCode
class QRVerifier(APIView):
    permission_classes = [IsAuthenticated]
    
    @handle_exceptions
    def post(self, request):
        """
        Проверка QR кода и определение действия:
        
        Логика редиректов:
        1. Не продан + менеджер -> показать форму продажи (action: 'sell')
        2. Не продан + не менеджер -> редирект на партнера (action: 'redirect')
        3. Продан -> редирект на партнера (action: 'redirect')
        4. Активирован -> редирект на партнера (action: 'redirect')
        """
        is_manager = hasattr(request.user, 'userprofile') and request.user.userprofile.is_manager
        
        code = request.data.get('code')
        if not code:
            return Response(
                {'error': 'Не указан код'},
                status=status.HTTP_400_BAD_REQUEST,
            )
            
        qr_code = QRCode.objects.filter(code=code).first()
        if not qr_code:
            return Response(
                {'error': 'QR код не найден'},
                status=status.HTTP_404_NOT_FOUND,
            )
        
        # непроданный код для менеджера - показываем форму продажи
        if not qr_code.is_selled and is_manager:
            account_type_display = {
                'L': 'Стартовый',
                'M': 'Оптимальный',
                'P': 'Премиум'
            }.get(qr_code.account_type, qr_code.account_type)
            
            imageURL = f"{settings.BASE_URL}{qr_code.image.url}" if qr_code.image else None
            
            return Response(
                {
                    'action': 'sell',
                    'message': 'QR код не продан',
                    'qr_code': {
                        'code': qr_code.code,
                        'imageURL': imageURL,
                        'account_type': account_type_display,
                        'partner': qr_code.partner.partner_name,
                        'created_at': qr_code.created_at,
                    }
                },
                status=status.HTTP_200_OK,
            )
        
        # во всех остальных случаях - редирект на партнера
        redirect_url = qr_code.partner.redirect_url
        
        redirect_reason = []
        if qr_code.is_selled:
            redirect_reason.append('QR код уже продан')
        if qr_code.is_active:
            redirect_reason.append('QR код уже активирован')
        if not is_manager:
            redirect_reason.append('Пользователь не является менеджером')
        
        reason_message = ', '.join(redirect_reason) if redirect_reason else 'Перенаправление на сайт партнера'
        
        return Response(
            {
                'action': 'redirect',
                'redirect_url': redirect_url,
                'message': reason_message,
                'debug_info': {
                    'is_selled': qr_code.is_selled,
                    'is_active': qr_code.is_active,
                    'is_manager': is_manager,
                } if settings.DEBUG else None
            },
            status=status.HTTP_200_OK,
        )
    
    @handle_exceptions
    def patch(self, request):
        """
        Продажа QR кода менеджером (активация для продажи)
        """
        code = request.data.get('code')
        if not code:
            return Response(
                {'error': 'Не указан код'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        # проверяем что пользователь - менеджер
        if not hasattr(request.user, 'userprofile') or not request.user.userprofile.is_manager:
            return Response(
                {'error': 'Только менеджеры могут продавать QR коды'},
                status=status.HTTP_403_FORBIDDEN,
            )
        
        qr_code = QRCode.objects.filter(code=code, is_selled=False).first()
        if not qr_code:
            return Response(
                {'error': 'QR код не найден или уже продан'},
                status=status.HTTP_404_NOT_FOUND,
            )
        
        # отмечаем как проданный
        qr_code.is_selled = True
        qr_code.selled_by = request.user
        qr_code.is_selled_timestamp = timezone.now()
        qr_code.active_before = timezone.now() + timedelta(days=60)
        qr_code.save()
        
        return Response(
            {
                'message': 'QR код успешно продан',
                'qr_code': {
                    'code': qr_code.code,
                    'is_selled': True,
                    'selled_at': qr_code.is_selled_timestamp,
                    'selled_by': request.user.username,
                }
            },
            status=status.HTTP_200_OK,
        )