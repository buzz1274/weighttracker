from django.conf import settings
from google.auth.transport import requests
from google.oauth2 import id_token

from user.authentication.authenticator_interface import AuthenticatorInterface
from user.authentication.exceptions import AuthenticationException


class Google(AuthenticatorInterface):
    GOOGLE_CLIENT_ID = settings.GOOGLE_OAUTH2_CLIENT_ID

    def decode_credentials(self, credentials: str) -> dict:
        try:
            return id_token.verify_oauth2_token(
                credentials, requests.Request(), self.GOOGLE_CLIENT_ID
            )
        except Exception as e:
            raise AuthenticationException(f"Failed to decode credentials:{e}")
