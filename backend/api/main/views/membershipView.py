from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from api.utils.exceptionsHandler import handle_exceptions
from api.main.serializers.membershipSerializer import MembershipPlansSerializer

from sitemanagement.models import Membership

class MembershipPlansView(APIView):
    @handle_exceptions
    def get(self, request):
        memberships = Membership.objects.all()
        
        data = {
            'memberships': MembershipPlansSerializer(memberships, many=True).data
        }
        
        return Response(data, status=status.HTTP_200_OK)