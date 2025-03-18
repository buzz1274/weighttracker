from rest_framework import viewsets
from rest_framework.response import Response

from user.models.user import User
from user.serializers.user_serializer import UserSerializer


class UserViewSet(viewsets.ViewSet):
    def retrieve(self, request) -> Response:
        queryset = User.objects.filter(pk=1).get()
        serializer = UserSerializer(queryset)

        return Response(serializer.data)
