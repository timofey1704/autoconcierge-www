from django.urls import path
from .views.registerView import RegisterViewSet
from .views.loginView import LoginViewSet
from .views.logoutView import LogoutView
from .views.refreshTokenView import RefreshTokenView

urlpatterns = [
    path('login/', LoginViewSet.as_view({'post': 'login_client'}), name="login-client"),
    path("refresh/", RefreshTokenView.as_view(), name="token-refresh"),
    path("logout", LogoutView.as_view(), name="logout"),
    path("register/send-verification/", RegisterViewSet.as_view({'post': 'send_verification_code'}), name="send-verification"),
    path("register/verify/", RegisterViewSet.as_view({'post': 'verify_and_register_client'}), name="verify-and-register"),
]
