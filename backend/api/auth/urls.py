from django.urls import path
from .views.registerView import RegisterViewSet
from .views.loginView import LoginViewSet
from .views.loginManagerView import LoginManagerViewSet
from .views.logoutView import LogoutView
from .views.refreshTokenView import RefreshTokenView
from .views.userView import UserDataView

urlpatterns = [
    path('login/', LoginViewSet.as_view({'post': 'login_client'}), name="login-client"),
    path('login/manager/', LoginManagerViewSet.as_view({'post': 'login_manager'}), name="login-manager"),
    path("refresh/", RefreshTokenView.as_view(), name="token-refresh"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("register/send-verification/", RegisterViewSet.as_view({'post': 'send_verification_code'}), name="send-verification"),
    path("register/verify/", RegisterViewSet.as_view({'post': 'verify_and_register_client'}), name="verify-and-register"),
    path("user/", UserDataView.as_view({'get': 'user_data'}), name="user-data")
]
