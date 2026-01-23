from rest_framework import status
from rest_framework.viewsets import ViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response

from api.auth.serializers.managerResponseSerializer import ManagerResponseSerializer
from api.models import UserProfile

from api.utils.decorators import handle_exceptions

class ManagerDataView(ViewSet):
    """Эндпоинт для наполнения стора фронта данными"""
    permission_classes = [IsAuthenticated]
    
    def initial(self, request, *args, **kwargs):
        try:
            super().initial(request, *args, **kwargs)
        except Exception as e:
            print(f"Authentication error: {e}")
            raise
    
    @action(detail=False, methods=['get'])
    @handle_exceptions
    def manager_data(self, request):
        user = request.user
        
        try:
            user_data = ManagerResponseSerializer(user).data
            return Response(user_data, status=status.HTTP_200_OK)
        except UserProfile.DoesNotExist:
            return Response(
                {"error": "User profile not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )