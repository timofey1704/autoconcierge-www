from rest_framework import serializers
from sitemanagement.models import Car
from django.conf import settings

class CarSerializer(serializers.ModelSerializer):
    brand = serializers.SerializerMethodField()
    model = serializers.SerializerMethodField()
    body_type = serializers.SerializerMethodField()
    color = serializers.SerializerMethodField()
    lising_company = serializers.SerializerMethodField()
    qr_code = serializers.SerializerMethodField()
    qr_image = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    year_built = serializers.SerializerMethodField()
    
    class Meta:
        model = Car
        fields = [
            'id',
            'vin_code',
            'brand',
            'model',
            'body_type',
            'year_built',
            'color',
            'lising_company',
            'qr_code',
            'qr_image',
            'image',
            'year_built',
        ]
    
    def get_brand(self, obj):
        return obj.brand.name if obj.brand else None
    
    def get_model(self, obj):
        return obj.model.name if obj.model else None
    
    def get_body_type(self, obj):
        return obj.body_type.name if obj.body_type else None
    
    def get_color(self, obj):
        return obj.color.name if obj.color else None
    
    def get_lising_company(self, obj):
        return obj.lising_company.partner_name if obj.lising_company else None
    
    def get_qr_code(self, obj):
        return obj.qr_code.code if obj.qr_code else None
    
    def get_qr_image(self, obj):
        if obj.qr_code and obj.qr_code.image:
            try:
                relative_url = obj.qr_code.image.url
                base_url = settings.BASE_URL
                base_url = base_url.rstrip('/')
                relative_url = relative_url.lstrip('/')
                return f"{base_url}/{relative_url}"
            except Exception:
                return None
        return None
    
    def get_image(self, obj):
        if obj.image:
            try:
                relative_url = obj.image.url
                base_url = settings.BASE_URL
                base_url = base_url.rstrip('/')
                relative_url = relative_url.lstrip('/')
                return f"{base_url}/{relative_url}"
            except Exception:
                return None
        return None
    
    def get_year_built(self, obj):
        return obj.year_built if obj.year_built else None