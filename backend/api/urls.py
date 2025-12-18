from django.urls import path, include

urlpatterns = [
   path('v1/main/', include('api.main.urls'))
]