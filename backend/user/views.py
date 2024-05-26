# from urllib.parse import urlencode
from rest_framework import serializers
from rest_framework.views import APIView

from .authentication.authentication import Authentication

# from django.conf import settings
# from django.shortcuts import redirect
# from rest_framework.response import Response
# from .mixins import PublicApiMixin, ApiErrorsMixin
# from .services import google_get_access_token, google_get_user_info
# from .models import User
from .serializers import LoginSerializer


class LoginApi(APIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        validated_data = serializer.validated_data

        credential = validated_data.get("credential")
        authenticator = Authentication(
            authentication_method=validated_data.get("authentication_method")
        )

        token = authenticator.get_access_token(validated_data.get("credential"))

        print("HHHDGDGGDGGD")
        print(credential)
        print(token)
        print("Dhfhfhhfhfhfh")

        """
        input_serializer.is_valid(raise_exception=True)

        validated_data = input_serializer.validated_data

        code = validated_data.get('code')
        error = validated_data.get('error')

        login_url = f'{settings.BASE_FRONTEND_URL}/login'

        if error or not code:
            params = urlencode({'error': error})
            return redirect(f'{login_url}?{params}')

        redirect_uri = f'{settings.BASE_FRONTEND_URL}/google/'
        access_token = google_get_access_token(code=code,
                                               redirect_uri=redirect_uri)

        user_data = google_get_user_info(access_token=access_token)

        try:
            user = User.objects.get(email=user_data['email'])
            access_token, refresh_token = generate_tokens_for_user(user)
            response_data = {
                'user': UserSerializer(user).data,
                'access_token': str(access_token),
                'refresh_token': str(refresh_token)
            }
            return Response(response_data)
        except User.DoesNotExist:
            username = user_data['email'].split('@')[0]
            first_name = user_data.get('given_name', '')
            last_name = user_data.get('family_name', '')

            user = User.objects.create(
                username=username,
                email=user_data['email'],
                first_name=first_name,
                last_name=last_name,
                registration_method='google',
                phone_no=None,
                referral=None
            )

            access_token, refresh_token = generate_tokens_for_user(user)
            response_data = {
                'user': UserSerializer(user).data,
                'access_token': str(access_token),
                'refresh_token': str(refresh_token)
            }
            return Response(response_data)
        """
