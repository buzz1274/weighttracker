from rest_framework import serializers

from user.models.user import User


class LoginSerializer(serializers.Serializer):
    authentication_method = serializers.CharField(required=True)
    code = serializers.CharField(required=True)
