import requests
from django.conf import settings

from .authenticator import AuthenticatorInterface


class Google(AuthenticatorInterface):
    GOOGLE_ID_TOKEN_INFO_URL = "https://www.googleapis.com/oauth2/v3/tokeninfo"
    GOOGLE_ACCESS_TOKEN_OBTAIN_URL = "https://oauth2.googleapis.com/token"
    GOOGLE_USER_INFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo"

    def get_access_token(self, credential: str):
        print(credential)

        data = {
            "code": credential,
            "client_id": settings.GOOGLE_OAUTH2_CLIENT_ID,
            "client_secret": settings.GOOGLE_OAUTH2_CLIENT_SECRET,
            "redirect_uri": "",
            "grant_type": "authorization_code",
        }

        response = requests.post(self.GOOGLE_ACCESS_TOKEN_OBTAIN_URL, data=data)

        print(settings.GOOGLE_OAUTH2_CLIENT_ID)
        print(response.json())

        # fix so we copy the directory into container and then mount over top.
