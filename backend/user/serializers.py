from rest_framework import serializers

from .models import User


class LoginSerializer(serializers.Serializer):
    authentication_method = serializers.CharField(required=True)
    code = serializers.CharField(required=True)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "height_m",
            "starting_weight_kg",
            "target_weight_kg",
            "sex",
            "authentication_method",
        ]
