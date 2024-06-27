from django.db.models.base import ObjectDoesNotExist
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .authentication.authentication import Authentication
from .authentication.exceptions import AuthenticationException
from .models import User
from .serializers import LoginSerializer


class LoginApi(APIView):
    permission_classes = (AllowAny,)
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        validated_data = serializer.validated_data

        try:
            authenticator = Authentication(
                authentication_method=validated_data.get(
                    "authentication_method"
                )
            ).authenticator

            token = authenticator.get_access_token(validated_data.get("code"))
            user_data = authenticator.get_user_info(token["access_token"])
        except AuthenticationException as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        try:
            user = User.objects.get(email=user_data["email"])
            response_data = {
                "email": user["email"],
            }
        except ObjectDoesNotExist:
            response_data = {
                "email": user_data["email"],
                "registered": False,
            }

        if token:
            response_data.update(
                {
                    "refresh_token": token["refresh_token"],
                    "access_token": token["access_token"],
                }
            )

        return Response(response_data, status=status.HTTP_200_OK)
