from rest_framework import serializers
from sitemanagement.models import Transactions, Membership
from django.contrib.auth import get_user_model

User = get_user_model()

class MembershipSerializer(serializers.ModelSerializer):
    """Сериализатор для выдачи тарифных планов"""
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    membership = serializers.PrimaryKeyRelatedField(queryset=Membership.objects.all())

    class Meta:
        model = Transactions
        fields = ('id', 'user', 'membership', 'amount', 'auto_renewal', 'status', 'request_id', 'created_at', 'subscription_start', 'subscription_end')