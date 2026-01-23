from rest_framework.viewsets import ViewSet
from rest_framework.decorators import action
from rest_framework.response import Response

from dictionaries.models import Cities, Brand, Model, BodyType
from api.utils.pagination import StandardResultsSetPagination

from api.account.serializers.dictionariesSerializers import (CityListSerializer, 
CitySerializer, 
BrandSerializer, 
ModelSerializer,
BodyTypeSerializer)

from api.utils.decorators import handle_exceptions

class DictionariesView(ViewSet):
    """Эндпоинт для получения данных для выбора (изначальные словари заполняются админами)"""
    
    @action(detail=False, methods=['get'])
    @handle_exceptions
    def get_cities(self, request):
        cities = Cities.objects.all()
        serializer = CityListSerializer(cities, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    @handle_exceptions
    def get_brands(self, request):
        brands = Brand.objects.all()
        serializer = BrandSerializer(brands, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    @handle_exceptions
    def get_models(self, request):
        models = Model.objects.all()
        serializer = ModelSerializer(models, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    @handle_exceptions
    def get_body_types(self, request):
        body_types = BodyType.objects.all()
        serializer = BodyTypeSerializer(body_types, many=True)
        return Response(serializer.data)
    
class CityView(ViewSet):
    """Получаем список городов из базы для автокомплита"""
    pagination_class = StandardResultsSetPagination
    
    @action(detail=False, methods=['get'])
    @handle_exceptions
    def get_cities(self, request):
        # получаем параметр id города из query params
        city_id = request.query_params.get('id')
        
        # базовый QuerySet
        cities = Cities.objects.all()
        
        # фильтруем по id если указан
        if city_id:
            try:
                cities = cities.filter(id=city_id)
            except ValueError:
                cities = Cities.objects.none()
            
        # поиск по названию города
        search = request.query_params.get('search', '').strip()
        
        if search:
            try:
                # нормализуем поисковый запрос
                search = search.lower().replace('ё', 'е')
                
                # фильтруем города, где название начинается с поискового запроса
                cities = cities.filter(name__istartswith=search)
                
                # получаем все отфильтрованные города
                all_cities = list(cities)
                
                # сортируем результаты:
                # 1. точные совпадения по имени
                # 2. остальные по алфавиту
                exact_matches = [
                    city for city in all_cities
                    if city.name and city.name.lower().replace('ё', 'е') == search
                ]
                
                other_matches = [
                    city for city in all_cities
                    if city not in exact_matches
                ]
                
                # объединяем результаты, сохраняя порядок
                cities = exact_matches + sorted(other_matches, key=lambda x: x.name)
                
            except Exception as e:
                cities = Cities.objects.none()
        else:
            # если нет поиска, просто сортируем по названию
            cities = cities.order_by('name')
        
        # применяем пагинацию
        paginator = self.pagination_class()
        paginated_cities = paginator.paginate_queryset(cities, request)
        
        serialized_data = CitySerializer(paginated_cities, many=True).data
        
        return paginator.get_paginated_response(serialized_data)