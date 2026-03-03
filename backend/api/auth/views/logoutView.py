from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

class LogoutView(APIView):
    """Выход из системы"""
    
    def post(self, request):
        response = Response({'message': 'Logged out'}, status=status.HTTP_200_OK)
        
        # чистим куки (те же samesite/secure, что при установке; max_age=0 = удаление)
        response.set_cookie('access_token', '', max_age=0, path='/', samesite='None', secure=True)
        response.set_cookie('refresh_token', '', max_age=0, path='/', samesite='None', secure=True)
        response.delete_cookie('sessionid', path='/') 