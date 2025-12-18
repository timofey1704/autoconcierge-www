from django.urls import path
from .views.membershipView import MembershipPlansView
from .views.faqView import FAQView

urlpatterns = [
    path("get-memberships/", MembershipPlansView.as_view(), name="memberships"),
    path("get-faqs/", FAQView.as_view(), name="faqs"),
]
