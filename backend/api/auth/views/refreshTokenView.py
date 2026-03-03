from rest_framework import status
from rest_framework.views import APIView

from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from django.contrib.auth.models import User

from api.utils.cookiesSetter import set_auth_cookies

class RefreshTokenCookieView(APIView):
    """Refresh по cookie refresh_token. Возвращает ответ с новыми access/refresh в Set-Cookie (для продления сессии)."""
    def post(self, request):
        refresh_token_str = request.COOKIES.get('refresh_token')
        if not refresh_token_str:
            return Response(
                {'error': 'Refresh token cookie required'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        try:
            old_refresh = RefreshToken(refresh_token_str)
            user_id = old_refresh.get('user_id')
            user = User.objects.get(pk=user_id)
        except (Exception, User.DoesNotExist):
            return Response(
                {'error': 'Invalid or expired refresh token'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        new_refresh = RefreshToken.for_user(user)
        response = Response({'message': 'Token refreshed'}, status=status.HTTP_200_OK)
        set_auth_cookies(response, new_refresh)
        return response