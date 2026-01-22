from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from api.models import UserProfile

from api.auth.serializers.userResponseSerializer import UserResponseSerializer
from api.utils.cookiesSetter import AuthBaseViewSet
from api.utils.decorators import handle_exceptions
class LoginViewSet(AuthBaseViewSet):
    """Логин для клиента"""
    
    @action(detail=False, methods=['post'], url_path="login")
    @handle_exceptions
    def login_client(self, request):
        try:
            phone_number = request.data.get("phone_number")
            password = request.data.get("password")
            
            if not phone_number or not password:
                return Response(
                    {"error": "Номер телефона и пароль обязательны"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            try:
                user_profile = UserProfile.objects.get(phone_number=phone_number)
                user = user_profile.user
            except UserProfile.DoesNotExist:
                return Response(
                    {"error": "Пользователь не найден"},
                    status=status.HTTP_404_NOT_FOUND
                )
            if not user.check_password(password):
                return Response(
                    {"error": "Неверный пароль"},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            refresh = RefreshToken.for_user(user)
            
            user_data = UserResponseSerializer(user).data
            
            response = Response({
                "message": "Успешная авторизация",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": user_data
            }, status=status.HTTP_200_OK)
            
            # сеттим куки
            return self._set_auth_cookies(response, refresh)
                
        except Exception as e:
            return Response(
                {"error": "Ошибка авторизации"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )