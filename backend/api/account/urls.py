from django.urls import path
from api.account.views.dictionariesActions import *
from api.account.views.changeProfileData import ChangeProfileDataView
from api.account.views.carActions import CarActionsViewSet
from api.account.views.dashboardActions import DashboardViewSet

urlpatterns = [
    path('dictionaries/cities/', CityView.as_view({'get': 'get_cities'}), name='get_cities'),
    path('dictionaries/car-types/', DictionariesView.as_view({'get': 'get_brands'}), name='get-brands'),
    path('dictionaries/car-breeds/', DictionariesView.as_view({'get': 'get_models'}), name='get-models'),
    path('dictionaries/car-colors/', DictionariesView.as_view({'get': 'get_body_types'}), name='get-boty-types'),
    path('change-profile-data/', ChangeProfileDataView.as_view({'patch': 'change_profile_contacts_data'}), name='change_profile_contacts_data'),
    path('cars/', CarActionsViewSet.as_view({'get': 'get_cars'}), name='get_cars'),
    path('dashboard/get-data/', DashboardViewSet.as_view({'get': 'get_manager_clients'}), name='manager_clients'),
    path('dashboard/statistics/', DashboardViewSet.as_view({'get': 'get_statistics'}), name='dashboard_statistics'),
]
