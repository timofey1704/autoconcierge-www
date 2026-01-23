from rest_framework import status
from rest_framework.viewsets import ViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response

from django.shortcuts import get_object_or_404
from django.core.validators import validate_email
from django.core.exceptions import ValidationError

from api.models import UserProfile
from api.auth.serializers.userResponseSerializer import UserResponseSerializer
from api.utils.decorators import handle_exceptions

from dictionaries.models import Cities