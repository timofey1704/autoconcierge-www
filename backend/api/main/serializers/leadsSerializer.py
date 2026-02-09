from rest_framework import serializers
from sitemanagement.models import Leads

class LeadsSerializer(serializers.ModelSerializer):
    phone_number_subscription = serializers.CharField(
        source='phone_number',
        max_length=17,
        write_only=True
    )
    class Meta:
        model = Leads
        fields = ['phone_number_subscription']  
     
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['phone_number'] = instance.phone_number
        return representation