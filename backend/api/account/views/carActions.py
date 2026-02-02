import logging
from typing import cast

from rest_framework.viewsets import ViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

from django.utils import timezone


from api.utils.decorators import handle_exceptions
from api.account.serializers.carSerializers import CarSerializer, CarCreateSerializer

from sitemanagement.models import Car
from sitemanagement.models import QRCode

logger = logging.getLogger(__name__)
class CarActionsViewSet(ViewSet):
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    @handle_exceptions
    def get_cars(self, request):
        cars = Car.objects.filter(user=request.user, is_deleted=False)
        serializer = CarSerializer(cars, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    @handle_exceptions
    def create_car(self, request):
        """Создание нового автомобиля"""
        # получаем код QR из запроса
        qr_code_value = request.data.get('qr_code')

        if not qr_code_value:
            return Response(
                {"error": "QR код не указан"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # ищем существующий QR код
        qr_code = QRCode.objects.filter(code=qr_code_value, is_used=False, status='active', is_selled=True).first()
        if not qr_code:
            return Response(
                {"error": "QR код не найден или уже использован"},
                status=status.HTTP_404_NOT_FOUND
            )     
        serializer = CarCreateSerializer(data=request.data)
        if not serializer.is_valid():
            logger.error(f"Serializer errors: {serializer.errors}")
            return Response(
                {"errors": serializer.errors}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # сохраняем автомобиль с привязкой QR кода, пользователя и лизинговой компании из QR кода
            car = cast(Car, serializer.save(
                user=request.user, 
                qr_code=qr_code,
                lising_company=qr_code.partner  # берем партнера из QR кода
            ))
            
            # помечаем QR код как использованный
            qr_code.is_used = True
            qr_code.user = request.user
            qr_code.is_active = True
            qr_code.is_active_timestamp = timezone.now()
            qr_code.save()
            
            response_serializer = CarSerializer(car)
            
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            # если что-то пошло не так, удаляем автомобиль
            logger.error(f"Ошибка при создании автомобиль: {str(e)}")
            if 'car' in locals():
                car.delete()
            return Response(
                {"error": f"Ошибка при создании автомобиль: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['patch'])
    @handle_exceptions
    def delete_car(self, request, pk=None):
        """Удаление автомобиля"""
        try:
            car = Car.objects.get(pk=pk, user=request.user)
        except Car.DoesNotExist:
            return Response(
                {"error": "Автомобиль не найден или не принадлежит вам"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        try:            
            #! cкрываем автомобиль от клиента, сохраняя его в базе (AVT-72)
            car.is_deleted = True
            car.save()
            
            return Response(
                {"message": "Автомобиль успешно удален"},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            logger.error(f"Ошибка при удалении автомобиля: {str(e)}")
            return Response(
                {"error": f"Ошибка при удалении автомобиля: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )