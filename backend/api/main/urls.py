from django.urls import path
from .views.membershipView import MembershipPlansView
from .views.faqView import FAQView
from .views.leadsView import LeadsView

urlpatterns = [
    path("get-memberships/", MembershipPlansView.as_view(), name="memberships"),
    path("get-faqs/", FAQView.as_view(), name="faqs"),
    path("send-lead/", LeadsView.as_view(), name="leads"),
]
