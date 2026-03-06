from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from api.utils.cookiesSetter import clear_auth_cookies


class LogoutView(APIView):
    """Выход из системы"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        response = Response({"message": "Выход успешен"}, status=status.HTTP_200_OK)
        clear_auth_cookies(response)
        response.delete_cookie('sessionid', path='/')
        return response