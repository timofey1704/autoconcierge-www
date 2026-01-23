from django.urls import path
from api.account.views.dictionariesActions import *
from api.account.views.changeProfileData import ChangeProfileDataView
from api.account.views.carActions import CarActionsViewSet

urlpatterns = [
    path('dictionaries/cities/', CityView.as_view({'get': 'get_cities'}), name='get_cities'),
    path('dictionaries/pet-types/', DictionariesView.as_view({'get': 'get_brands'}), name='get-brands'),
    path('dictionaries/pet-breeds/', DictionariesView.as_view({'get': 'get_models'}), name='get-models'),
    path('dictionaries/pet-colors/', DictionariesView.as_view({'get': 'get_body_types'}), name='get-boty-types'),
    path('change-profile-data/', ChangeProfileDataView.as_view({'patch': 'change_profile_contacts_data'}), name='change_profile_contacts_data'),
    path('cars/', CarActionsViewSet.as_view({'get': 'get_cars'}), name='get_cars'),
]
