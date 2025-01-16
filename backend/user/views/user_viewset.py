from django.conf import settings
from rest_framework import viewsets
from rest_framework.response import Response

from ..models.user import User
from ..serializers.user_serializer import UserSerializer


class UserViewSet(viewsets.ViewSet):
    def retrieve(self, request):
        queryset = User.objects.filter(pk=settings.USER_ID).get()
        serializer = UserSerializer(queryset)

        return Response(serializer.data)
