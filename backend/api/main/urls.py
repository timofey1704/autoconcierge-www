from django.urls import path
from .views.membershipView import MembershipPlansView

urlpatterns = [
    path("get-memberships/", MembershipPlansView.as_view(), name="memberships"),
]
