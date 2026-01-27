from rest_framework import serializers
from sitemanagement.constants.account_types import account_types
from sitemanagement.models import Feature, Membership, Tranasctions

class FeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feature
        fields = ['id', 'name']
        
class MembershipPlansSerializer(serializers.ModelSerializer):
    features = FeatureSerializer(many=True, read_only=True)
    plan = serializers.SerializerMethodField()
    price = serializers.IntegerField()
    is_recommended = serializers.BooleanField()
    actual_before = serializers.SerializerMethodField(
        help_text="Дата окончания подписки пользователя для данного тарифа"
    )
    
    def get_plan(self, obj):
        return dict(account_types)[obj.plan]
    
    def get_actual_before(self, obj):
        """
        Получить дату окончания подписки для текущего пользователя и данного тарифа.
        
        Возвращает дату окончания подписки (subscription_end) из последней завершенной
        транзакции пользователя для данного тарифного плана.
        
        Returns:
            datetime or None: Дата окончания подписки в формате ISO 8601 или None,
                            если у пользователя нет активной подписки
        """
        # получаем пользователя из контекста запроса
        request = self.context.get('request')
        
        # если запрос не авторизован, возвращаем None
        if not request or not request.user.is_authenticated:
            return None
        
        # находим последнюю завершенную транзакцию для этого пользователя и тарифа
        transaction = Tranasctions.objects.filter(
            user=request.user,
            membership=obj,
            status='completed'
        ).order_by('-subscription_end').first()
        
        # возвращаем дату окончания подписки или None
        return transaction.subscription_end if transaction else None
    
    class Meta:
        model = Membership
        fields = ["id", "plan", "price", "is_recommended", "actual_before", "features"]