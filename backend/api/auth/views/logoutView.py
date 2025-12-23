from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

class LogoutView(APIView):
    """Выход из системы"""
    
    def post(self, request):
        response = Response({'message': 'Logged out'}, status=status.HTTP_200_OK)
        
        # чистим куки и sessionID
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        response.delete_cookie('sessionid') 
        
        return response