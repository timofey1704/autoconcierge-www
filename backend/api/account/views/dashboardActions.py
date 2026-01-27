from rest_framework.viewsets import ViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

from api.utils.decorators import handle_exceptions
from sitemanagement.models import QRCode
from api.account.serializers.dashboardSerializer import DashboardSerializer


class DashboardViewSet(ViewSet):
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'], url_path='get-data')
    @handle_exceptions
    def get_manager_clients(self, request):
        """
        Получить все QR-коды, проданные текущим менеджером
        
        Query параметры:
        - membership_type: L (Light), M (Medium), P (Premium) - можно передать несколько через запятую
        - is_active: true/false - фильтр по статусу активации клиентом
        - search: поиск по ФИО клиента, номеру телефона или коду QR
        - sort_by: поле для сортировки (last_activity, client_name, membership_type)
        - sort_order: asc/desc - порядок сортировки
        """
        user = request.user
        
        # проверяем, что пользователь - менеджер
        if not hasattr(user, 'userprofile') or user.userprofile.user_type != 'manager':
            return Response(
                {'error': 'Только менеджеры могут получить эти данные'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # начинаем с базового фильтра по менеджеру
        qr_codes = QRCode.objects.filter(selled_by=user)
        
        # фильтр по типу membership
        membership_type = request.query_params.get('membership_type', None)
        if membership_type:
            # поддерживаем множественный выбор через запятую
            membership_types = [mt.strip().upper() for mt in membership_type.split(',')]
            qr_codes = qr_codes.filter(account_type__in=membership_types)
        
        # фильтр по статусу активности
        is_active = request.query_params.get('is_active', None)
        if is_active is not None:
            # преобразуем строку в булево значение
            is_active_bool = is_active.lower() in ['true', '1', 'yes']
            qr_codes = qr_codes.filter(is_active=is_active_bool)
        
        # поиск
        search_query = request.query_params.get('search', None)
        if search_query:
            from django.db.models import Q
            qr_codes = qr_codes.filter(
                Q(code__icontains=search_query) |  # поиск по коду QR
                Q(user__first_name__icontains=search_query) |  # поиск по имени
                Q(user__last_name__icontains=search_query) |  # поиск по фамилии
                Q(user__userprofile__phone_number__icontains=search_query)  # поиск по телефону
            )
        
        # применяем select_related для оптимизации запросов
        qr_codes = qr_codes.select_related(
            'user',
            'user__userprofile',
            'partner'
        )
        
        # сортировка
        sort_by = request.query_params.get('sort_by', 'last_activity')
        sort_order = request.query_params.get('sort_order', 'desc')
        
        # маппинг полей для сортировки
        sort_fields = {
            'last_activity': 'is_active_timestamp',
            'client_name': 'user__last_name',
            'membership_type': 'account_type',
            'is_active': 'is_active',
        }
        
        order_field = sort_fields.get(sort_by, 'is_selled_timestamp')
        if sort_order == 'desc':
            order_field = f'-{order_field}'
        
        qr_codes = qr_codes.order_by(order_field)
        
        serializer = DashboardSerializer(qr_codes, many=True)
        
        return Response({
            'data': serializer.data,
            'count': qr_codes.count(),
            'filters': {
                'membership_type': membership_type,
                'is_active': is_active,
                'search': search_query,
                'sort_by': sort_by,
                'sort_order': sort_order
            }
        }, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'], url_path='statistics')
    @handle_exceptions
    def get_statistics(self, request):
        """
        Получить статистику по QR-кодам менеджера для фильтров
        """
        user = request.user
        
        # проверяем, что пользователь - менеджер
        if not hasattr(user, 'userprofile') or user.userprofile.user_type != 'manager':
            return Response(
                {'error': 'Только менеджеры могут получить эти данные'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # базовый queryset
        base_queryset = QRCode.objects.filter(selled_by=user)
        
        # статистика по типам membership
        membership_stats = {
            'L': base_queryset.filter(account_type='L').count(),
            'M': base_queryset.filter(account_type='M').count(),
            'P': base_queryset.filter(account_type='P').count(),
        }
        
        # статистика по активности
        activity_stats = {
            'active': base_queryset.filter(is_active=True).count(),
            'inactive': base_queryset.filter(is_active=False).count(),
        }
        
        return Response({
            'total': base_queryset.count(),
            'membership_types': membership_stats,
            'activity': activity_stats,
        }, status=status.HTTP_200_OK)