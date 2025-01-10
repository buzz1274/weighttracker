import requests
from django.conf import settings

from .authenticator_interface import AuthenticatorInterface
from .exceptions import AuthenticationException


class Google(AuthenticatorInterface):
    GOOGLE_ID_TOKEN_INFO_URL = "https://www.googleapis.com/oauth2/v3/tokeninfo"
    GOOGLE_ACCESS_TOKEN_OBTAIN_URL = "https://oauth2.googleapis.com/token"
    GOOGLE_USER_INFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo"

    def get_access_token(self, code: str) -> dict:
        data = {
            "code": code,
            "client_id": settings.GOOGLE_OAUTH2_CLIENT_ID,
            "client_secret": settings.GOOGLE_OAUTH2_CLIENT_SECRET,
            "redirect_uri": "http://dev.weighttracker.zz50.co.uk:5123",
            "grant_type": "authorization_code",
        }

        response = requests.post(
            self.GOOGLE_ACCESS_TOKEN_OBTAIN_URL, data=data
        )

        if not response.ok:
            raise AuthenticationException(
                "Failed to obtain access token from google"
            )

        return response.json()

    def get_user_info(self, access_token: str) -> dict:
        response = requests.get(
            self.GOOGLE_USER_INFO_URL, params={"access_token": access_token}
        )

        if not response.ok:
            raise AuthenticationException(
                "Failed to obtain user info from google"
            )

        return response.json()
