from django.conf import settings
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from api.utils.exceptionsHandler import handle_exceptions

from sitemanagement.models import QRCode

class QRPublicVerifier(APIView):
    """
    Публичный эндпоинт для проверки QR кода БЕЗ авторизации.
    Используется для редиректа неавторизованных пользователей на партнерский сайт.
    """
    permission_classes = [AllowAny]
    
    @handle_exceptions
    def post(self, request):
        """
        Получает redirect_url для QR кода без проверки авторизации
        """
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
        # !!всегда возвращаем redirect_url на партнера
        redirect_url = qr_code.partner.redirect_url
        
        return Response(
            {
                'action': 'redirect',
                'redirect_url': redirect_url,
                'message': 'Перенаправление на сайт партнера',
            },
            status=status.HTTP_200_OK,
        )
