from rest_framework import serializers


class LoginSerializer(serializers.Serializer):
    authentication_method = serializers.CharField(required=True)
    code = serializers.CharField(required=True)
