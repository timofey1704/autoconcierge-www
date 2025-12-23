from rest_framework import serializers

from django.conf import settings

class UserResponseSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    email = serializers.EmailField()
    account_type = serializers.CharField(source='userprofile.account_type')
    name = serializers.CharField(source='first_name')
    surname = serializers.CharField(source='last_name')
    phone_number = serializers.CharField(source='userprofile.phone_number')
    image = serializers.SerializerMethodField()
    uuid = serializers.SerializerMethodField()
  
    def get_uuid(self, obj):
        try:
            return str(obj.userprofile.uuid)[:6]
        except Exception as e:
            return None

    def get_image(self, obj):
        try:
            if obj.userprofile.image:
                relative_url = obj.userprofile.image.url
                base_url = settings.BASE_URL
                base_url = base_url.rstrip('/')
                relative_url = relative_url.lstrip('/')
                full_url = f"{base_url}/{relative_url}"
                return full_url
            return None
        except Exception as e:
            return None