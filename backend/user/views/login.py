from datetime import datetime
from typing import Tuple

from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from user.authentication.authentication import Authentication
from user.authentication.authenticator_interface import AuthenticatorInterface
from user.authentication.exceptions import AuthenticationException
from user.models.user import User
from user.serializers.serializers import LoginSerializer
from user.serializers.user_serializer import UserSerializer


class Login(APIView):
    permission_classes = (AllowAny,)
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer: LoginSerializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        validated_data = serializer.validated_data

        try:
            authentication_backend: str = validated_data.get(
                "authentication_backend"
            )
            authenticator: AuthenticatorInterface = Authentication(
                authentication_backend=authentication_backend
            ).authenticator

            user_data: dict = authenticator.decode_credentials(
                validated_data.get("credentials")
            )

            user: Tuple[User, bool] = User.objects.get_or_create(
                email=user_data["email"],
                authentication_backend=authentication_backend,
                defaults={
                    "first_name": user_data["given_name"],
                    "last_name": user_data["family_name"],
                    "weight_loss_start_date": datetime.now(),
                },
            )

            return Response(
                UserSerializer(instance=user[0], partial=True).data,
                status=status.HTTP_200_OK,
            )

        except (IndexError, AuthenticationException) as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
