from rest_framework import serializers

from django.conf import settings

class ManagerResponseSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    account_type = serializers.CharField(source='userprofile.manager_account_type')
    firstName = serializers.CharField(source='first_name')
    surname = serializers.CharField(source='last_name')
    image = serializers.SerializerMethodField()
    uuid = serializers.SerializerMethodField()
    partner = serializers.CharField(source='userprofile.partner')
  
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