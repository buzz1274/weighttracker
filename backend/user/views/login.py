from django.db.models.base import ObjectDoesNotExist
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .authentication.authentication import Authentication
from .authentication.exceptions import AuthenticationException
from .models.user import User
from .serializers import LoginSerializer, UserSerializer


class Login(APIView):
    permission_classes = (AllowAny,)
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        validated_data = serializer.validated_data

        try:
            authentication_method = validated_data.get("authentication_method")
            authenticator = Authentication(
                authentication_method=authentication_method
            ).authenticator

            token = authenticator.get_access_token(validated_data.get("code"))
            user_data = authenticator.get_user_info(token["access_token"])
        except AuthenticationException as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        try:
            user = User.objects.get(email=user_data["email"])
        except ObjectDoesNotExist:
            user = User(
                email=user_data["email"],
                username=user_data["email"],
                password="",
                authentication_method=authentication_method,
            )

            user.save()

        user = UserSerializer(data=user, partial=True)
        user.is_valid(raise_exception=True)

        user_data = user.data

        if token:
            user_data.update(
                {
                    "refresh_token": token["refresh_token"],
                    "access_token": token["access_token"],
                }
            )

        return Response(user_data, status=status.HTTP_200_OK)
