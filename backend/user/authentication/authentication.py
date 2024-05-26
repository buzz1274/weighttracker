from .authenticator import AuthenticatorInterface
from .google import Google


class Authentication:
    PERMITTED_AUTHENTICATION_SERVICES = {
        "GOOGLE": Google,
    }

    authentication_method: str = None
    authenticator: AuthenticatorInterface = None

    def __init__(self, *, authentication_method: str = "GOOGLE") -> None:
        if authentication_method not in self.PERMITTED_AUTHENTICATION_SERVICES.keys():
            raise RuntimeError(f"Invalid authentication method {authentication_method}")

        self.authentication_method = authentication_method
        self.authenticator = self.PERMITTED_AUTHENTICATION_SERVICES[
            self.authentication_method
        ]()

    def get_access_token(self, credential: str) -> str:
        """get access token from remote oauth provider"""
        return self.authenticator.get_access_token(credential)
