from rest_framework import status
from rest_framework.views import APIView

from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
import traceback

from django.conf import settings
from datetime import datetime

class RefreshTokenView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            
            if not refresh_token:
                return Response(
                    {'error': 'Refresh token is required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                token = RefreshToken(refresh_token)

                # точное время истечения токена
                expires_at = datetime.now() + settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME']
                
                response_data = {
                    'access': str(token.access_token),
                    'refresh': str(token),
                    'expires_at': datetime.timestamp(expires_at)
                }
                
                return Response(response_data)
                
            except Exception as e:
                # логируем ошибки
               
                print(f"Token refresh error: {str(e)}")
                print(traceback.format_exc())
                
                return Response(
                    {'error': f'Invalid refresh token: {str(e)}'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

        except Exception as e:
            return Response(
                {'error': f'Token refresh failed: {str(e)}'}, 
                status=status.HTTP_400_BAD_REQUEST
            )