from rest_framework import serializers
from dictionaries.models import Cities, Brand, Model, BodyType

class CitySerializer(serializers.ModelSerializer):
    "Сериалиалайзер для выдачи городов"
    display_name = serializers.SerializerMethodField()
    
    def get_display_name(self, obj):
        """Возвращает отформатированное название города с страной"""
        return f"{obj.name}, {obj.country}"
    
    class Meta:
        model = Cities
        fields = ('id', 'name', 'country', 'display_name')

class CityListSerializer(serializers.ModelSerializer):
    """Сериализатор для выдачи списка городов"""
    class Meta:
        model = Cities
        fields = ('id', 'name', 'country')
        
class BrandSerializer(serializers.ModelSerializer):
    """Сериализатор для выдачи марок автомобилей"""
    class Meta:
        model = Brand
        fields = ('id', 'name')
        
class ModelSerializer(serializers.ModelSerializer):
    """Сериализатор для выдачи моделей автомобилей"""
    pet_type = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Model
        fields = ('id', 'name', 'brand')
        
class BodyTypeSerializer(serializers.ModelSerializer):
    """Сериализатор для выдачи типов кузовов автомобилей"""
    pet_type = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = BodyType
        fields = ('id', 'name', 'model')