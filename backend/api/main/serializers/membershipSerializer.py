from rest_framework import serializers
from sitemanagement.constants.account_types import account_types
from sitemanagement.models import Feature, Membership

class FeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feature
        fields = ['id', 'name']
        
class MembershipPlansSerializer(serializers.ModelSerializer):
    features = FeatureSerializer(many=True, read_only=True)
    plan = serializers.SerializerMethodField()
    
    def get_plan(self, obj):
        return dict(account_types)[obj.plan]
    
    class Meta:
        model = Membership
        fields = "__all__"