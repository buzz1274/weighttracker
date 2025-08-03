from django.db.models import QuerySet
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from user.models.user import User
from user.serializers.user_serializer import UserSerializer
from user.serializers.user_update_serializer import UserUpdateSerializer


class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    pagination_class = None

    def get_serializer_class(self):
        if self.action == "partial_update" or self.action == "update":
            return UserUpdateSerializer

        return super().get_serializer_class()

    def get_queryset(self) -> QuerySet:
        context = self.get_serializer_context()

        return User.objects.filter(pk=context.get("request").user.pk)

    def retrieve(self, request, *args, **kwargs) -> Response:
        queryset = User.objects.filter(pk=request.user.pk).get()
        serializer = UserSerializer(queryset)

        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        get_object_or_404(User, pk=request.user.pk)

        return super().partial_update(request, *args, **kwargs)
