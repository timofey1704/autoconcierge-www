from django.urls import path, include

urlpatterns = [
   path('v1/main/', include('api.main.urls')),
   path('v1/auth/', include('api.auth.urls')),
]