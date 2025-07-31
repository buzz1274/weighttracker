from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from user.models.user import User
from user.serializers.user_serializer import UserSerializer


class UserViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def retrieve(self, request) -> Response:
        queryset = User.objects.filter(pk=request.user.pk).get()
        serializer = UserSerializer(queryset)

        return Response(serializer.data)
