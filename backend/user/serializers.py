from abc import ABCMeta

from rest_framework import serializers


class LoginSerializer(serializers.Serializer):
    authentication_method = serializers.CharField(required=True)
    credential = serializers.CharField(required=True)
    error = serializers.CharField(required=False)
