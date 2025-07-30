from rest_framework import serializers


class LoginSerializer(serializers.Serializer):
    authentication_backend = serializers.CharField(required=True)
    credentials = serializers.CharField(required=True)
