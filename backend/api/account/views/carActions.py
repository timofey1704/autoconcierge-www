from rest_framework.viewsets import ViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response

from api.utils.decorators import handle_exceptions

from sitemanagement.models import Car
from api.account.serializers.carSerializers import CarSerializer

class CarActionsViewSet(ViewSet):
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    @handle_exceptions
    def get_cars(self, request):
        cars = Car.objects.filter(user=request.user)
        serializer = CarSerializer(cars, many=True)
        return Response(serializer.data)