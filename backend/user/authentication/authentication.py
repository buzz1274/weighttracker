from user.authentication.authenticator_interface import AuthenticatorInterface
from user.authentication.google import Google


class Authentication:
    PERMITTED_AUTHENTICATION_BACKENDS = {
        "GOOGLE": Google,
    }

    authentication_backend: str = None
    authenticator: AuthenticatorInterface = None

    def __init__(self, *, authentication_backend: str = "GOOGLE") -> None:
        if (
            authentication_backend
            not in self.PERMITTED_AUTHENTICATION_BACKENDS.keys()
        ):
            raise RuntimeError(
                f"Invalid authentication backend {authentication_backend}"
            )

        self.authentication_backend = authentication_backend
        self.authenticator = self.PERMITTED_AUTHENTICATION_BACKENDS[
            self.authentication_backend
        ]()
